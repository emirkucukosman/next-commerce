import { Header } from "@components/Header";
import { Container, Title } from "@mantine/core";
import React from "react";

// Props
type PageProps = {
  title: string;
  children?: React.ReactNode;
};

export const Page: React.FC<PageProps> = ({ title, children }) => {
  return (
    <div>
      <Header />
      <Container my="md">
        <Title mb="md">{title}</Title>
        {children}
      </Container>
    </div>
  );
};
