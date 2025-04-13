"use client";
import { useInstructionsConfigStore } from "@/core/config/instructions";
import { useMessagesConfigStore } from "@/core/config/messages";
import { useModelsConfigStore } from "@/core/config/models";
import { Configuration } from "@/ui/Configuration";
import { Button, Modal } from "@mantine/core";

export default function ConfigPage() {
  const { llm } = useModelsConfigStore();
  const { messages } = useMessagesConfigStore();
  const { instructions } = useInstructionsConfigStore();

  const downloadConfig = () => {
    const config = {
      llm,
      messages,
      instructions,
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "config.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Modal
        opened
        radius="md"
        onClose={() => {}}
        withCloseButton={false}
        centered
      >
        <Configuration />
      </Modal>
      <Button
        pos="fixed"
        style={{ zIndex: 1000 }}
        bottom={16}
        right={16}
        variant="default"
        size="xs"
        onClick={downloadConfig}
      >
        Download Config
      </Button>
    </>
  );
}
