import { Card } from "@chakra-ui/react";

export function Message({ children }: { children: React.ReactNode }) {
  // center card with content
  return (
    <Card
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        padding: "1rem",
        transform: "translate(-50%, -50%)",
        fontSize: "2rem",
        textAlign: "center",
        width: "90%",
        border: "1px solid black",
        height: 450,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </Card>
  );
}
