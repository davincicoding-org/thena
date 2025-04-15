"use strict";
(self.webpackChunkconcentraid = self.webpackChunkconcentraid || []).push([
  [933],
  {
    "./ui/task-manager/TaskWizard.stories.tsx": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      __webpack_require__.r(__webpack_exports__),
        __webpack_require__.d(__webpack_exports__, {
          Default: () => Default,
          __namedExportsOrder: () => __namedExportsOrder,
          default: () => TaskWizard_stories,
        });
      var jsx_runtime = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
        ),
        dist = __webpack_require__(
          "./node_modules/.pnpm/@storybook+test@8.6.12_storybook@8.6.12/node_modules/@storybook/test/dist/index.mjs",
        ),
        external_STORYBOOK_MODULE_PREVIEW_API_ = __webpack_require__(
          "storybook/internal/preview-api",
        ),
        Stack = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Stack/Stack.mjs",
        ),
        TextInput = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/TextInput/TextInput.mjs",
        ),
        Button = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Button/Button.mjs",
        ),
        Card = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Card/Card.mjs",
        ),
        Flex = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Flex/Flex.mjs",
        ),
        Text = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Text/Text.mjs",
        ),
        Tooltip = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Tooltip/Tooltip.mjs",
        ),
        ActionIcon = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/ActionIcon/ActionIcon.mjs",
        ),
        Divider = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Divider/Divider.mjs",
        ),
        use_disclosure = __webpack_require__(
          "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-disclosure/use-disclosure.mjs",
        ),
        use_input_state = __webpack_require__(
          "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-input-state/use-input-state.mjs",
        ),
        IconPlus = __webpack_require__(
          "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/icons/IconPlus.mjs",
        ),
        react = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        ),
        v4 = __webpack_require__(
          "./node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm-browser/v4.js",
        ),
        IconX = __webpack_require__(
          "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/icons/IconX.mjs",
        );
      function ActionTextInput({ onEnter, onClear, ...props }) {
        return (0, jsx_runtime.jsx)(TextInput.k, {
          ...props,
          onChange: (e) => {
            var _props_onChange;
            null === (_props_onChange = props.onChange) ||
              void 0 === _props_onChange ||
              _props_onChange.call(props, e.currentTarget.value);
          },
          onKeyDown: (e) => {
            var _props_onKeyDown;
            "Enter" === e.key && (null == onEnter || onEnter()),
              null === (_props_onKeyDown = props.onKeyDown) ||
                void 0 === _props_onKeyDown ||
                _props_onKeyDown.call(props, e);
          },
          rightSection:
            onClear &&
            (0, jsx_runtime.jsx)(ActionIcon.M, {
              variant: "subtle",
              color: "red",
              onClick: onClear,
              children: (0, jsx_runtime.jsx)(IconX.A, { size: 16 }),
            }),
        });
      }
      function TaskWizard({ items, onChange }) {
        const inputRef = (0, react.useRef)(null),
          [isAddingTask, { open: openTaskAdder, close: closeTaskAdder }] = (0,
          use_disclosure.j)(!1),
          [input, setInput] = (0, use_input_state.D)(""),
          addTask = () => {
            0 !== input.length &&
              (onChange([...items, createTask(input)]),
              setInput(""),
              closeTaskAdder());
          },
          updateItem = (item) => {
            onChange(items.map((i) => (i.id === item.id ? item : i)));
          };
        return (0, jsx_runtime.jsxs)(Stack.B, {
          children: [
            items.map((item) =>
              "tasks" in item
                ? (0, jsx_runtime.jsx)(
                    ObjectiveForm,
                    { item, onChange: updateItem },
                    item.id,
                  )
                : (0, jsx_runtime.jsx)(
                    ActionTextInput,
                    {
                      value: item.title,
                      onChange: (title) => updateItem({ ...item, title }),
                      onEnter: () => addTask(),
                      onClear: () =>
                        ((item) => {
                          onChange(items.filter((i) => i.id !== item.id));
                        })(item),
                    },
                    item.id,
                  ),
            ),
            isAddingTask
              ? (0, jsx_runtime.jsx)(TextInput.k, {
                  ref: inputRef,
                  value: input,
                  onChange: setInput,
                  onBlur: close,
                  onKeyDown: (e) => {
                    "Enter" === e.key && addTask();
                  },
                })
              : (0, jsx_runtime.jsx)(Button.$, {
                  size: "xs",
                  variant: "light",
                  leftSection: (0, jsx_runtime.jsx)(IconPlus.A, { size: 12 }),
                  onClick: () => {
                    openTaskAdder(),
                      setTimeout(() => {
                        var _inputRef_current;
                        null === (_inputRef_current = inputRef.current) ||
                          void 0 === _inputRef_current ||
                          _inputRef_current.focus();
                      }, 100);
                  },
                  children: "Add Task",
                }),
          ],
        });
      }
      function ObjectiveForm({ item, onChange }) {
        const inputRef = (0, react.useRef)(null),
          [isAddingTask, { open: openTaskAdder, close: closeTaskAdder }] = (0,
          use_disclosure.j)(!1),
          [input, setInput] = (0, use_input_state.D)(""),
          addTask = () => {
            0 !== input.length &&
              (onChange({ ...item, tasks: [...item.tasks, createTask(input)] }),
              setInput(""),
              closeTaskAdder());
          };
        return (0, jsx_runtime.jsxs)(Card.Z, {
          withBorder: !0,
          p: "sm",
          children: [
            (0, jsx_runtime.jsxs)(Flex.s, {
              justify: "space-between",
              align: "center",
              gap: "md",
              children: [
                (0, jsx_runtime.jsx)(Text.E, { children: item.title }),
                (0, jsx_runtime.jsx)(Tooltip.m, {
                  label: "Add Task",
                  position: "bottom",
                  withArrow: !0,
                  disabled: isAddingTask,
                  children: (0, jsx_runtime.jsx)(ActionIcon.M, {
                    size: "sm",
                    disabled: isAddingTask,
                    variant: "light",
                    onClick: () => {
                      openTaskAdder(),
                        setTimeout(() => {
                          var _inputRef_current;
                          null === (_inputRef_current = inputRef.current) ||
                            void 0 === _inputRef_current ||
                            _inputRef_current.focus();
                        }, 100);
                    },
                    children: (0, jsx_runtime.jsx)(IconPlus.A, { size: 16 }),
                  }),
                }),
              ],
            }),
            (0, jsx_runtime.jsx)(Card.Z.Section, {
              my: "xs",
              children: (0, jsx_runtime.jsx)(Divider.c, {}),
            }),
            (0, jsx_runtime.jsxs)(Stack.B, {
              gap: "xs",
              children: [
                item.tasks.map((task) =>
                  (0, jsx_runtime.jsx)(
                    ActionTextInput,
                    {
                      value: task.title,
                      onChange: (title) =>
                        ((task) => {
                          onChange({
                            ...item,
                            tasks: item.tasks.map((t) =>
                              t.id === task.id ? task : t,
                            ),
                          });
                        })({ ...task, title }),
                      onEnter: () => addTask(),
                      onClear: () =>
                        ((task) => {
                          onChange({
                            ...item,
                            tasks: item.tasks.filter((t) => t.id !== task.id),
                          });
                        })(task),
                    },
                    task.id,
                  ),
                ),
                isAddingTask &&
                  (0, jsx_runtime.jsx)(TextInput.k, {
                    ref: inputRef,
                    value: input,
                    onChange: setInput,
                    onBlur: closeTaskAdder,
                    onKeyDown: (e) => {
                      "Enter" === e.key && addTask();
                    },
                  }),
              ],
            }),
          ],
        });
      }
      ActionTextInput.__docgenInfo = {
        description: "",
        methods: [],
        displayName: "ActionTextInput",
        props: {
          onChange: {
            required: !1,
            tsType: {
              name: "signature",
              type: "function",
              raw: "(value: string) => void",
              signature: {
                arguments: [{ type: { name: "string" }, name: "value" }],
                return: { name: "void" },
              },
            },
            description: "",
          },
          onEnter: {
            required: !1,
            tsType: {
              name: "signature",
              type: "function",
              raw: "() => void",
              signature: { arguments: [], return: { name: "void" } },
            },
            description: "",
          },
          onClear: {
            required: !1,
            tsType: {
              name: "signature",
              type: "function",
              raw: "() => void",
              signature: { arguments: [], return: { name: "void" } },
            },
            description: "",
          },
        },
        composes: ["Omit"],
      };
      const createTask = (title) => ({ id: (0, v4.A)(), title });
      TaskWizard.__docgenInfo = {
        description: "",
        methods: [],
        displayName: "TaskWizard",
        props: {
          items: {
            required: !0,
            tsType: {
              name: "Array",
              elements: [{ name: "unknown" }],
              raw: "(Objective | Task)[]",
            },
            description: "",
          },
          onChange: {
            required: !0,
            tsType: {
              name: "signature",
              type: "function",
              raw: "(items: (Objective | Task)[]) => void",
              signature: {
                arguments: [
                  {
                    type: {
                      name: "Array",
                      elements: [{ name: "unknown" }],
                      raw: "(Objective | Task)[]",
                    },
                    name: "items",
                  },
                ],
                return: { name: "void" },
              },
            },
            description: "",
          },
        },
      };
      const TaskWizard_stories = {
          component: TaskWizard,
          parameters: { layout: "centered" },
          tags: ["autodocs"],
        },
        Default = {
          args: {
            items: [
              {
                id: "1",
                title: "Build a task management app",
                tasks: [
                  { id: "3", title: "Engineer requirements" },
                  { id: "1", title: "Define tech stack" },
                  { id: "2", title: "Setup codebase" },
                ],
              },
              { id: "2", title: "Reply to client email" },
              { id: "3", title: "Buy groceries" },
            ],
            onChange: (0, dist.fn)(),
          },
          render: (args) => {
            const [{ items }, updateArgs] = (0,
            external_STORYBOOK_MODULE_PREVIEW_API_.useArgs)();
            return (0, jsx_runtime.jsx)(TaskWizard, {
              ...args,
              items,
              onChange: (items) => {
                updateArgs({ items });
              },
            });
          },
        },
        __namedExportsOrder = ["Default"];
      Default.parameters = {
        ...Default.parameters,
        docs: {
          ...Default.parameters?.docs,
          source: {
            originalSource:
              '{\n  args: {\n    items: [{\n      id: "1",\n      title: "Build a task management app",\n      tasks: [{\n        id: "3",\n        title: "Engineer requirements"\n      }, {\n        id: "1",\n        title: "Define tech stack"\n      }, {\n        id: "2",\n        title: "Setup codebase"\n      }]\n    }, {\n      id: "2",\n      title: "Reply to client email"\n    }, {\n      id: "3",\n      title: "Buy groceries"\n    }],\n    onChange: fn()\n  },\n  render: args => {\n    const [{\n      items\n    }, updateArgs] = useArgs<TaskWizardProps>();\n    const handleChange = (items: TaskWizardProps["items"]) => {\n      updateArgs({\n        items\n      });\n    };\n    return <TaskWizard {...args} items={items} onChange={handleChange} />;\n  }\n}',
            ...Default.parameters?.docs?.source,
          },
        },
      };
    },
  },
]);
