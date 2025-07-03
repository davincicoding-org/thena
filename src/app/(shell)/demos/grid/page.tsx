"use client";

import { useState } from "react";
import { Card, Center, Container } from "@mantine/core";

import { Main } from "@/app/(shell)/shell";
import { cn } from "@/ui/utils";

export default function Grid() {
  const [expanded, setExpanded] = useState<number>();

  return (
    <Main display="grid">
      <Center className="h-full">
        <Container
          className={cn(
            "flex h-[50dvh] w-3xl flex-col gap-8 transition-all duration-500",
          )}
          onMouseLeave={() => setExpanded(undefined)}
        >
          <div
            className={cn(
              "flex basis-1/2 gap-8 transition-all duration-500 *:transition-all *:duration-500",
              {
                "basis-2/3": expanded && expanded <= 3,
                "basis-1/3": expanded && expanded > 3,
              },
            )}
          >
            <Card
              radius="md"
              className={cn("basis-1/4", {
                "basis-1/2": expanded === 1,
                "basis-1/3": expanded === undefined || expanded > 3,
              })}
              onMouseEnter={() => setExpanded(1)}
            >
              <p
                className={cn("m-0 text-2xl transition-all duration-500", {
                  "text-4xl": expanded === 1,
                })}
              >
                First
              </p>
            </Card>
            <Card
              radius="md"
              className={cn("basis-1/4", {
                "basis-1/2": expanded === 2,
                "basis-1/3": expanded === undefined || expanded > 3,
              })}
              onMouseEnter={() => setExpanded(2)}
            >
              <p
                className={cn("m-0 text-2xl transition-all duration-500", {
                  "text-4xl": expanded === 2,
                })}
              >
                Second
              </p>
            </Card>
            <Card
              radius="md"
              className={cn("basis-1/4", {
                "basis-1/2": expanded === 3,
                "basis-1/3": expanded === undefined || expanded > 3,
              })}
              onMouseEnter={() => setExpanded(3)}
            >
              <p
                className={cn("m-0 text-2xl transition-all duration-500", {
                  "text-4xl": expanded === 3,
                })}
              >
                Third
              </p>
            </Card>
          </div>
          <div
            className={cn(
              "flex basis-1/2 gap-8 transition-all duration-500 *:transition-all *:duration-500",
              {
                "basis-2/3": expanded && expanded > 3,
                "basis-1/3": expanded && expanded <= 3,
              },
            )}
          >
            <Card
              radius="md"
              className={cn("basis-1/2", {
                "basis-2/3": expanded === 4,
                "basis-1/3": expanded === 5,
              })}
              onMouseEnter={() => setExpanded(4)}
            >
              <p
                className={cn("m-0 text-2xl transition-all duration-500", {
                  "text-4xl": expanded === 4,
                })}
              >
                Fourth
              </p>
            </Card>
            <Card
              radius="md"
              className={cn("basis-1/2", {
                "basis-2/3": expanded === 5,
                "basis-1/3": expanded === 4,
              })}
              onMouseEnter={() => setExpanded(5)}
            >
              <p
                className={cn("m-0 text-2xl transition-all duration-500", {
                  "text-4xl": expanded === 5,
                })}
              >
                Fifth
              </p>
            </Card>
          </div>
        </Container>
      </Center>
    </Main>
  );
}
