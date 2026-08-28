"use client";

import { useCallback, useMemo, useReducer } from "react";
import { maskCPF, stripCPF } from "@/domain/cpf";
import type { Cents } from "@/domain/money";
import {
  MIN_INSTALLMENTS,
  quote,
  type PaymentMethod,
  type Quote,
} from "@/domain/pricing";
import { createOrder } from "@/services/order.service";
import type { Product } from "@/services/schemas";
import { buildInstallmentOptions, type InstallmentOption } from "./installmentOptions";
import {
  validateBuyer,
  visibleErrors,
  type FieldErrors,
  type FieldName,
} from "./validation";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD_ORDER: FieldName[] = ["email", "cpf"];

interface State {
  method: PaymentMethod;
  installments: number;
  email: string;
  cpf: string;
  touched: Partial<Record<FieldName, boolean>>;
  submitAttempted: boolean;
  status: Status;
  orderId: string | null;
  submitError: string | null;
}

type Action =
  | { type: "setMethod"; method: PaymentMethod }
  | { type: "setInstallments"; installments: number }
  | { type: "setEmail"; value: string }
  | { type: "setCpf"; value: string }
  | { type: "touch"; field: FieldName }
  | { type: "submitBlocked" }
  | { type: "submitStart" }
  | { type: "submitSuccess"; orderId: string }
  | { type: "submitFailure"; message: string };

const INITIAL_STATE: State = {
  method: "pix",
  installments: 1,
  email: "",
  cpf: "",
  touched: {},
  submitAttempted: false,
  status: "idle",
  orderId: null,
  submitError: null,
};

const SUBMIT_ERROR_MESSAGES: Record<string, string> = {
  invalid: "Confira os dados informados e tente novamente.",
  declined: "Pagamento não autorizado. Tente outra forma de pagamento.",
  unavailable: "Não foi possível concluir agora. Tente novamente em instantes.",
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "setMethod":
      return {
        ...state,
        method: action.method,
        installments: action.method === "pix" ? MIN_INSTALLMENTS : state.installments,
        submitError: null,
      };
    case "setInstallments":
      return { ...state, installments: action.installments, submitError: null };
    case "setEmail":
      return { ...state, email: action.value.trim(), submitError: null };
    case "setCpf":
      return { ...state, cpf: maskCPF(action.value), submitError: null };
    case "touch":
      return { ...state, touched: { ...state.touched, [action.field]: true } };
    case "submitBlocked":
      return { ...state, submitAttempted: true };
    case "submitStart":
      return { ...state, submitAttempted: true, status: "submitting", submitError: null };
    case "submitSuccess":
      return { ...state, status: "success", orderId: action.orderId };
    case "submitFailure":
      return { ...state, status: "error", submitError: action.message };
    default:
      return state;
  }
}

export interface UseCheckoutResult {
  method: PaymentMethod;
  installments: number;
  email: string;
  cpf: string;
  quote: Quote;
  pixSavings: Cents;
  installmentOptions: InstallmentOption[];
  errors: FieldErrors;
  isSubmitting: boolean;
  isSuccess: boolean;
  orderId: string | null;
  submitError: string | null;
  selectMethod: (method: PaymentMethod) => void;
  selectInstallments: (installments: number) => void;
  changeEmail: (value: string) => void;
  changeCpf: (value: string) => void;
  blurEmail: () => void;
  blurCpf: () => void;
  submit: () => Promise<FieldName | null>;
}

export function useCheckout(product: Product): UseCheckoutResult {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const { method, installments, email, cpf } = state;

  const currentQuote = useMemo(
    () => quote(product.currentPrice, method, installments),
    [product.currentPrice, method, installments],
  );

  const pixSavings = useMemo(
    () => quote(product.currentPrice, "card", installments).producerFee,
    [product.currentPrice, installments],
  );

  const installmentOptions = useMemo(
    () => buildInstallmentOptions(product.currentPrice),
    [product.currentPrice],
  );

  const allErrors = useMemo(() => validateBuyer({ email, cpf }), [email, cpf]);

  const errors = useMemo(
    () =>
      visibleErrors(allErrors, {
        touched: state.touched,
        submitAttempted: state.submitAttempted,
      }),
    [allErrors, state.touched, state.submitAttempted],
  );

  const selectMethod = useCallback(
    (next: PaymentMethod) => dispatch({ type: "setMethod", method: next }),
    [],
  );
  const selectInstallments = useCallback(
    (next: number) => dispatch({ type: "setInstallments", installments: next }),
    [],
  );
  const changeEmail = useCallback(
    (value: string) => dispatch({ type: "setEmail", value }),
    [],
  );
  const changeCpf = useCallback(
    (value: string) => dispatch({ type: "setCpf", value }),
    [],
  );
  const blurEmail = useCallback(() => dispatch({ type: "touch", field: "email" }), []);
  const blurCpf = useCallback(() => dispatch({ type: "touch", field: "cpf" }), []);

  const submit = useCallback(async (): Promise<FieldName | null> => {
    const firstInvalid = FIELD_ORDER.find((field) => allErrors[field]);
    if (firstInvalid) {
      dispatch({ type: "submitBlocked" });
      return firstInvalid;
    }

    dispatch({ type: "submitStart" });

    try {
      const result = await createOrder({
        productId: product.id,
        email,
        cpf: stripCPF(cpf),
        method,
        installments: currentQuote.installments,
      });

      if (result.ok) {
        dispatch({ type: "submitSuccess", orderId: result.orderId });
        return null;
      }

      dispatch({
        type: "submitFailure",
        message: SUBMIT_ERROR_MESSAGES[result.reason],
      });
    } catch {
      dispatch({
        type: "submitFailure",
        message: SUBMIT_ERROR_MESSAGES.unavailable,
      });
    }

    return null;
  }, [allErrors, product.id, email, cpf, method, currentQuote.installments]);

  return {
    method,
    installments,
    email,
    cpf,
    quote: currentQuote,
    pixSavings,
    installmentOptions,
    errors,
    isSubmitting: state.status === "submitting",
    isSuccess: state.status === "success",
    orderId: state.orderId,
    submitError: state.submitError,
    selectMethod,
    selectInstallments,
    changeEmail,
    changeCpf,
    blurEmail,
    blurCpf,
    submit,
  };
}
