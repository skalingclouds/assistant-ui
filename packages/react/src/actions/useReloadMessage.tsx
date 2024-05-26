import { useAssistantContext } from "../utils/context/AssistantContext";
import { useCombinedStore } from "../utils/context/combined/useCombinedStore";
import { useMessageContext } from "../utils/context/useMessageContext";

export const useReloadMessage = () => {
  const { useThread, useBranchObserver } = useAssistantContext();
  const { useMessage } = useMessageContext();

  const disabled = useCombinedStore(
    [useThread, useMessage],
    (t, m) => t.isLoading || m.message.role !== "assistant",
  );

  if (disabled) return null;

  return () => {
    const message = useMessage.getState().message;
    if (message.role !== "assistant")
      throw new Error("Reloading is only supported on assistant messages");

    useBranchObserver.getState().reloadAt(message);
  };
};