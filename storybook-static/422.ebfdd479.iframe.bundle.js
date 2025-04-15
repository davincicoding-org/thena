/*! For license information please see 422.ebfdd479.iframe.bundle.js.LICENSE.txt */
"use strict";
(self.webpackChunkconcentraid = self.webpackChunkconcentraid || []).push([
  [422],
  {
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/ActionIcon/ActionIcon.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { M: () => ActionIcon });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          get_size =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
            )),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          ),
          Loader = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Loader/Loader.mjs",
          ),
          Transition = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Transition/Transition.mjs",
          ),
          UnstyledButton = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/UnstyledButton/UnstyledButton.mjs",
          ),
          rem = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/units-converters/rem.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          ),
          classes = {
            root: "m_8d3f4000",
            icon: "m_8d3afb97",
            loader: "m_302b9fb1",
            group: "m_1a0f1b21",
            groupSection: "m_437b6484",
          };
        const defaultProps = { orientation: "horizontal" },
          varsResolver = (0, create_vars_resolver.V)((_, { borderWidth }) => ({
            group: { "--ai-border-width": (0, rem.D)(borderWidth) },
          })),
          ActionIconGroup = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "ActionIconGroup",
                defaultProps,
                _props,
              ),
              {
                className,
                style,
                classNames,
                styles,
                unstyled,
                orientation,
                vars,
                borderWidth,
                variant,
                mod,
                ...others
              } = (0, use_props.Y)("ActionIconGroup", defaultProps, _props),
              getStyles = (0, use_styles.I)({
                name: "ActionIconGroup",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
                rootSelector: "group",
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("group"),
              ref,
              variant,
              mod: [{ "data-orientation": orientation }, mod],
              role: "group",
              ...others,
            });
          });
        (ActionIconGroup.classes = classes),
          (ActionIconGroup.displayName = "@mantine/core/ActionIconGroup");
        const ActionIconGroupSection_defaultProps = {},
          ActionIconGroupSection_varsResolver = (0, create_vars_resolver.V)(
            (
              theme,
              { radius, color, gradient, variant, autoContrast, size },
            ) => {
              const colors = theme.variantColorResolver({
                color: color || theme.primaryColor,
                theme,
                gradient,
                variant: variant || "filled",
                autoContrast,
              });
              return {
                groupSection: {
                  "--section-height": (0, get_size.YC)(size, "section-height"),
                  "--section-padding-x": (0, get_size.YC)(
                    size,
                    "section-padding-x",
                  ),
                  "--section-fz": (0, get_size.ny)(size),
                  "--section-radius":
                    void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                  "--section-bg": color || variant ? colors.background : void 0,
                  "--section-color": colors.color,
                  "--section-bd": color || variant ? colors.border : void 0,
                },
              };
            },
          ),
          ActionIconGroupSection = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "ActionIconGroupSection",
                ActionIconGroupSection_defaultProps,
                _props,
              ),
              {
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                variant,
                gradient,
                radius,
                autoContrast,
                ...others
              } = (0, use_props.Y)(
                "ActionIconGroupSection",
                ActionIconGroupSection_defaultProps,
                _props,
              ),
              getStyles = (0, use_styles.I)({
                name: "ActionIconGroupSection",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver: ActionIconGroupSection_varsResolver,
                rootSelector: "groupSection",
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("groupSection"),
              ref,
              variant,
              ...others,
            });
          });
        (ActionIconGroupSection.classes = classes),
          (ActionIconGroupSection.displayName =
            "@mantine/core/ActionIconGroupSection");
        const ActionIcon_defaultProps = {},
          ActionIcon_varsResolver = (0, create_vars_resolver.V)(
            (
              theme,
              { size, radius, variant, gradient, color, autoContrast },
            ) => {
              const colors = theme.variantColorResolver({
                color: color || theme.primaryColor,
                theme,
                gradient,
                variant: variant || "filled",
                autoContrast,
              });
              return {
                root: {
                  "--ai-size": (0, get_size.YC)(size, "ai-size"),
                  "--ai-radius":
                    void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                  "--ai-bg": color || variant ? colors.background : void 0,
                  "--ai-hover": color || variant ? colors.hover : void 0,
                  "--ai-hover-color":
                    color || variant ? colors.hoverColor : void 0,
                  "--ai-color": colors.color,
                  "--ai-bd": color || variant ? colors.border : void 0,
                },
              };
            },
          ),
          ActionIcon = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)(
                "ActionIcon",
                ActionIcon_defaultProps,
                _props,
              ),
              {
                className,
                unstyled,
                variant,
                classNames,
                styles,
                style,
                loading,
                loaderProps,
                size,
                color,
                radius,
                __staticSelector,
                gradient,
                vars,
                children,
                disabled,
                "data-disabled": dataDisabled,
                autoContrast,
                mod,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: ["ActionIcon", __staticSelector],
                props,
                className,
                style,
                classes,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver: ActionIcon_varsResolver,
              });
            return (0, jsx_runtime.jsxs)(UnstyledButton.N, {
              ...getStyles("root", {
                active: !disabled && !loading && !dataDisabled,
              }),
              ...others,
              unstyled,
              variant,
              size,
              disabled: disabled || loading,
              ref,
              mod: [{ loading, disabled: disabled || dataDisabled }, mod],
              children: [
                (0, jsx_runtime.jsx)(Transition.e, {
                  mounted: !!loading,
                  transition: "slide-down",
                  duration: 150,
                  children: (transitionStyles) =>
                    (0, jsx_runtime.jsx)(Box.a, {
                      component: "span",
                      ...getStyles("loader", { style: transitionStyles }),
                      "aria-hidden": !0,
                      children: (0, jsx_runtime.jsx)(Loader.a, {
                        color: "var(--ai-color)",
                        size: "calc(var(--ai-size) * 0.55)",
                        ...loaderProps,
                      }),
                    }),
                }),
                (0, jsx_runtime.jsx)(Box.a, {
                  component: "span",
                  mod: { loading },
                  ...getStyles("icon"),
                  children,
                }),
              ],
            });
          });
        (ActionIcon.classes = classes),
          (ActionIcon.displayName = "@mantine/core/ActionIcon"),
          (ActionIcon.Group = ActionIconGroup),
          (ActionIcon.GroupSection = ActionIconGroupSection);
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Button/Button.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { $: () => Button });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          rem = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/units-converters/rem.mjs",
          ),
          get_size =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
            )),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          ),
          Loader = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Loader/Loader.mjs",
          ),
          Transition = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Transition/Transition.mjs",
          ),
          UnstyledButton = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/UnstyledButton/UnstyledButton.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          ),
          classes = {
            root: "m_77c9d27d",
            inner: "m_80f1301b",
            label: "m_811560b9",
            section: "m_a74036a",
            loader: "m_a25b86ee",
            group: "m_80d6d844",
            groupSection: "m_70be2a01",
          };
        const defaultProps = { orientation: "horizontal" },
          varsResolver = (0, create_vars_resolver.V)((_, { borderWidth }) => ({
            group: { "--button-border-width": (0, rem.D)(borderWidth) },
          })),
          ButtonGroup = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)("ButtonGroup", defaultProps, _props),
              {
                className,
                style,
                classNames,
                styles,
                unstyled,
                orientation,
                vars,
                borderWidth,
                variant,
                mod,
                ...others
              } = (0, use_props.Y)("ButtonGroup", defaultProps, _props),
              getStyles = (0, use_styles.I)({
                name: "ButtonGroup",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
                rootSelector: "group",
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("group"),
              ref,
              variant,
              mod: [{ "data-orientation": orientation }, mod],
              role: "group",
              ...others,
            });
          });
        (ButtonGroup.classes = classes),
          (ButtonGroup.displayName = "@mantine/core/ButtonGroup");
        const ButtonGroupSection_defaultProps = {},
          ButtonGroupSection_varsResolver = (0, create_vars_resolver.V)(
            (
              theme,
              { radius, color, gradient, variant, autoContrast, size },
            ) => {
              const colors = theme.variantColorResolver({
                color: color || theme.primaryColor,
                theme,
                gradient,
                variant: variant || "filled",
                autoContrast,
              });
              return {
                groupSection: {
                  "--section-height": (0, get_size.YC)(size, "section-height"),
                  "--section-padding-x": (0, get_size.YC)(
                    size,
                    "section-padding-x",
                  ),
                  "--section-fz": size?.includes("compact")
                    ? (0, get_size.ny)(size.replace("compact-", ""))
                    : (0, get_size.ny)(size),
                  "--section-radius":
                    void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                  "--section-bg": color || variant ? colors.background : void 0,
                  "--section-color": colors.color,
                  "--section-bd": color || variant ? colors.border : void 0,
                },
              };
            },
          ),
          ButtonGroupSection = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "ButtonGroupSection",
                ButtonGroupSection_defaultProps,
                _props,
              ),
              {
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                variant,
                gradient,
                radius,
                autoContrast,
                ...others
              } = (0, use_props.Y)(
                "ButtonGroupSection",
                ButtonGroupSection_defaultProps,
                _props,
              ),
              getStyles = (0, use_styles.I)({
                name: "ButtonGroupSection",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver: ButtonGroupSection_varsResolver,
                rootSelector: "groupSection",
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("groupSection"),
              ref,
              variant,
              ...others,
            });
          });
        (ButtonGroupSection.classes = classes),
          (ButtonGroupSection.displayName = "@mantine/core/ButtonGroupSection");
        const loaderTransition = {
            in: {
              opacity: 1,
              transform: `translate(-50%, calc(-50% + ${(0, rem.D)(1)}))`,
            },
            out: { opacity: 0, transform: "translate(-50%, -200%)" },
            common: { transformOrigin: "center" },
            transitionProperty: "transform, opacity",
          },
          Button_defaultProps = {},
          Button_varsResolver = (0, create_vars_resolver.V)(
            (
              theme,
              { radius, color, gradient, variant, size, justify, autoContrast },
            ) => {
              const colors = theme.variantColorResolver({
                color: color || theme.primaryColor,
                theme,
                gradient,
                variant: variant || "filled",
                autoContrast,
              });
              return {
                root: {
                  "--button-justify": justify,
                  "--button-height": (0, get_size.YC)(size, "button-height"),
                  "--button-padding-x": (0, get_size.YC)(
                    size,
                    "button-padding-x",
                  ),
                  "--button-fz": size?.includes("compact")
                    ? (0, get_size.ny)(size.replace("compact-", ""))
                    : (0, get_size.ny)(size),
                  "--button-radius":
                    void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                  "--button-bg": color || variant ? colors.background : void 0,
                  "--button-hover": color || variant ? colors.hover : void 0,
                  "--button-color": colors.color,
                  "--button-bd": color || variant ? colors.border : void 0,
                  "--button-hover-color":
                    color || variant ? colors.hoverColor : void 0,
                },
              };
            },
          ),
          Button = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)(
                "Button",
                Button_defaultProps,
                _props,
              ),
              {
                style,
                vars,
                className,
                color,
                disabled,
                children,
                leftSection,
                rightSection,
                fullWidth,
                variant,
                radius,
                loading,
                loaderProps,
                gradient,
                classNames,
                styles,
                unstyled,
                "data-disabled": dataDisabled,
                autoContrast,
                mod,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Button",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver: Button_varsResolver,
              }),
              hasLeftSection = !!leftSection,
              hasRightSection = !!rightSection;
            return (0, jsx_runtime.jsxs)(UnstyledButton.N, {
              ref,
              ...getStyles("root", {
                active: !disabled && !loading && !dataDisabled,
              }),
              unstyled,
              variant,
              disabled: disabled || loading,
              mod: [
                {
                  disabled: disabled || dataDisabled,
                  loading,
                  block: fullWidth,
                  "with-left-section": hasLeftSection,
                  "with-right-section": hasRightSection,
                },
                mod,
              ],
              ...others,
              children: [
                (0, jsx_runtime.jsx)(Transition.e, {
                  mounted: !!loading,
                  transition: loaderTransition,
                  duration: 150,
                  children: (transitionStyles) =>
                    (0, jsx_runtime.jsx)(Box.a, {
                      component: "span",
                      ...getStyles("loader", { style: transitionStyles }),
                      "aria-hidden": !0,
                      children: (0, jsx_runtime.jsx)(Loader.a, {
                        color: "var(--button-color)",
                        size: "calc(var(--button-height) / 1.8)",
                        ...loaderProps,
                      }),
                    }),
                }),
                (0, jsx_runtime.jsxs)("span", {
                  ...getStyles("inner"),
                  children: [
                    leftSection &&
                      (0, jsx_runtime.jsx)(Box.a, {
                        component: "span",
                        ...getStyles("section"),
                        mod: { position: "left" },
                        children: leftSection,
                      }),
                    (0, jsx_runtime.jsx)(Box.a, {
                      component: "span",
                      mod: { loading },
                      ...getStyles("label"),
                      children,
                    }),
                    rightSection &&
                      (0, jsx_runtime.jsx)(Box.a, {
                        component: "span",
                        ...getStyles("section"),
                        mod: { position: "right" },
                        children: rightSection,
                      }),
                  ],
                }),
              ],
            });
          });
        (Button.classes = classes),
          (Button.displayName = "@mantine/core/Button"),
          (Button.Group = ButtonGroup),
          (Button.GroupSection = ButtonGroupSection);
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Card/Card.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { Z: () => Card });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          get_size = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
          ),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          classes = { root: "m_1b7284a3" };
        const defaultProps = {},
          varsResolver = (0, create_vars_resolver.V)(
            (_, { radius, shadow }) => ({
              root: {
                "--paper-radius":
                  void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                "--paper-shadow": (0, get_size.dh)(shadow),
              },
            }),
          ),
          Paper = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)("Paper", defaultProps, _props),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                withBorder,
                vars,
                radius,
                shadow,
                variant,
                mod,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Paper",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ref,
              mod: [{ "data-with-border": withBorder }, mod],
              ...getStyles("root"),
              variant,
              ...others,
            });
          });
        (Paper.classes = classes), (Paper.displayName = "@mantine/core/Paper");
        const [CardProvider, useCardContext] = (function createSafeContext(
          errorMessage,
        ) {
          const Context = (0, react.createContext)(null);
          return [
            ({ children, value }) =>
              (0, jsx_runtime.jsx)(Context.Provider, { value, children }),
            () => {
              const ctx = (0, react.useContext)(Context);
              if (null === ctx) throw new Error(errorMessage);
              return ctx;
            },
          ];
        })("Card component was not found in tree");
        var Card_module_css_classes = {
          root: "m_e615b15f",
          section: "m_599a2148",
        };
        const CardSection_defaultProps = {},
          CardSection = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)(
                "CardSection",
                CardSection_defaultProps,
                _props,
              ),
              {
                classNames,
                className,
                style,
                styles,
                vars,
                withBorder,
                inheritPadding,
                mod,
                ...others
              } = props,
              ctx = useCardContext();
            return (0, jsx_runtime.jsx)(Box.a, {
              ref,
              mod: [
                {
                  "with-border": withBorder,
                  "inherit-padding": inheritPadding,
                },
                mod,
              ],
              ...ctx.getStyles("section", {
                className,
                style,
                styles,
                classNames,
              }),
              ...others,
            });
          });
        (CardSection.classes = Card_module_css_classes),
          (CardSection.displayName = "@mantine/core/CardSection");
        const Card_defaultProps = {},
          Card_varsResolver = (0, create_vars_resolver.V)((_, { padding }) => ({
            root: { "--card-padding": (0, get_size.GY)(padding) },
          })),
          Card = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)("Card", Card_defaultProps, _props),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                children,
                padding,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Card",
                props,
                classes: Card_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver: Card_varsResolver,
              }),
              _children = react.Children.toArray(children),
              content = _children.map((child, index) =>
                "object" == typeof child &&
                child &&
                "type" in child &&
                child.type === CardSection
                  ? (0, react.cloneElement)(child, {
                      "data-first-section": 0 === index || void 0,
                      "data-last-section":
                        index === _children.length - 1 || void 0,
                    })
                  : child,
              );
            return (0, jsx_runtime.jsx)(CardProvider, {
              value: { getStyles },
              children: (0, jsx_runtime.jsx)(Paper, {
                ref,
                unstyled,
                ...getStyles("root"),
                ...others,
                children: content,
              }),
            });
          });
        (Card.classes = Card_module_css_classes),
          (Card.displayName = "@mantine/core/Card"),
          (Card.Section = CardSection);
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Divider/Divider.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { c: () => Divider });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          get_size =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
            )),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          get_theme_color = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/color-functions/get-theme-color/get-theme-color.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          ),
          classes = { root: "m_3eebeb36", label: "m_9e365f20" };
        const defaultProps = { orientation: "horizontal" },
          varsResolver = (0, create_vars_resolver.V)(
            (theme, { color, variant, size }) => ({
              root: {
                "--divider-color": color
                  ? (0, get_theme_color.r)(color, theme)
                  : void 0,
                "--divider-border-style": variant,
                "--divider-size": (0, get_size.YC)(size, "divider-size"),
              },
            }),
          ),
          Divider = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)("Divider", defaultProps, _props),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                color,
                orientation,
                label,
                labelPosition,
                mod,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Divider",
                classes,
                props,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ref,
              mod: [{ orientation, "with-label": !!label }, mod],
              ...getStyles("root"),
              ...others,
              role: "separator",
              children:
                label &&
                (0, jsx_runtime.jsx)(Box.a, {
                  component: "span",
                  mod: { position: labelPosition },
                  ...getStyles("label"),
                  children: label,
                }),
            });
          });
        (Divider.classes = classes),
          (Divider.displayName = "@mantine/core/Divider");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Flex/Flex.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { s: () => Flex });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          filter_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/filter-props/filter-props.mjs",
          ),
          MantineThemeProvider =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
            )),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          InlineStyles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/InlineStyles/InlineStyles.mjs",
          ),
          parse_style_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/style-props/parse-style-props/parse-style-props.mjs",
          ),
          use_random_classname = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/use-random-classname/use-random-classname.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          );
        const FLEX_STYLE_PROPS_DATA = {
          gap: { type: "spacing", property: "gap" },
          rowGap: { type: "spacing", property: "rowGap" },
          columnGap: { type: "spacing", property: "columnGap" },
          align: { type: "identity", property: "alignItems" },
          justify: { type: "identity", property: "justifyContent" },
          wrap: { type: "identity", property: "flexWrap" },
          direction: { type: "identity", property: "flexDirection" },
        };
        var classes = { root: "m_8bffd616" };
        const defaultProps = {},
          Flex = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)("Flex", defaultProps, _props),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                gap,
                rowGap,
                columnGap,
                align,
                justify,
                wrap,
                direction,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Flex",
                classes,
                props,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
              }),
              theme = (0, MantineThemeProvider.xd)(),
              responsiveClassName = (0, use_random_classname.C)(),
              parsedStyleProps = (0, parse_style_props.X)({
                styleProps: {
                  gap,
                  rowGap,
                  columnGap,
                  align,
                  justify,
                  wrap,
                  direction,
                },
                theme,
                data: FLEX_STYLE_PROPS_DATA,
              });
            return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
              children: [
                parsedStyleProps.hasResponsiveStyles &&
                  (0, jsx_runtime.jsx)(InlineStyles.K, {
                    selector: `.${responsiveClassName}`,
                    styles: parsedStyleProps.styles,
                    media: parsedStyleProps.media,
                  }),
                (0, jsx_runtime.jsx)(Box.a, {
                  ref,
                  ...getStyles("root", {
                    className: responsiveClassName,
                    style: (0, filter_props.J)(parsedStyleProps.inlineStyles),
                  }),
                  ...others,
                }),
              ],
            });
          });
        (Flex.classes = classes), (Flex.displayName = "@mantine/core/Flex");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Loader/Loader.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { a: () => Loader });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          get_size = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
          ),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          get_theme_color = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/color-functions/get-theme-color/get-theme-color.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          ),
          clsx = __webpack_require__(
            "./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs",
          ),
          classes = {
            root: "m_5ae2e3c",
            barsLoader: "m_7a2bd4cd",
            bar: "m_870bb79",
            "bars-loader-animation": "m_5d2b3b9d",
            dotsLoader: "m_4e3f22d7",
            dot: "m_870c4af",
            "loader-dots-animation": "m_aac34a1",
            ovalLoader: "m_b34414df",
            "oval-loader-animation": "m_f8e89c4b",
          };
        const Bars = (0, react.forwardRef)(({ className, ...others }, ref) =>
          (0, jsx_runtime.jsxs)(Box.a, {
            component: "span",
            className: (0, clsx.A)(classes.barsLoader, className),
            ...others,
            ref,
            children: [
              (0, jsx_runtime.jsx)("span", { className: classes.bar }),
              (0, jsx_runtime.jsx)("span", { className: classes.bar }),
              (0, jsx_runtime.jsx)("span", { className: classes.bar }),
            ],
          }),
        );
        Bars.displayName = "@mantine/core/Bars";
        const Dots = (0, react.forwardRef)(({ className, ...others }, ref) =>
          (0, jsx_runtime.jsxs)(Box.a, {
            component: "span",
            className: (0, clsx.A)(classes.dotsLoader, className),
            ...others,
            ref,
            children: [
              (0, jsx_runtime.jsx)("span", { className: classes.dot }),
              (0, jsx_runtime.jsx)("span", { className: classes.dot }),
              (0, jsx_runtime.jsx)("span", { className: classes.dot }),
            ],
          }),
        );
        Dots.displayName = "@mantine/core/Dots";
        const Oval = (0, react.forwardRef)(({ className, ...others }, ref) =>
          (0, jsx_runtime.jsx)(Box.a, {
            component: "span",
            className: (0, clsx.A)(classes.ovalLoader, className),
            ...others,
            ref,
          }),
        );
        Oval.displayName = "@mantine/core/Oval";
        const defaultLoaders = { bars: Bars, oval: Oval, dots: Dots },
          defaultProps = { loaders: defaultLoaders, type: "oval" },
          varsResolver = (0, create_vars_resolver.V)(
            (theme, { size, color }) => ({
              root: {
                "--loader-size": (0, get_size.YC)(size, "loader-size"),
                "--loader-color": color
                  ? (0, get_theme_color.r)(color, theme)
                  : void 0,
              },
            }),
          ),
          Loader = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)("Loader", defaultProps, _props),
              {
                size,
                color,
                type,
                vars,
                className,
                style,
                classNames,
                styles,
                unstyled,
                loaders,
                variant,
                children,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Loader",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
              });
            return children
              ? (0, jsx_runtime.jsx)(Box.a, {
                  ...getStyles("root"),
                  ref,
                  ...others,
                  children,
                })
              : (0, jsx_runtime.jsx)(Box.a, {
                  ...getStyles("root"),
                  ref,
                  component: loaders[type],
                  variant,
                  size,
                  ...others,
                });
          });
        (Loader.defaultLoaders = defaultLoaders),
          (Loader.classes = classes),
          (Loader.displayName = "@mantine/core/Loader");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Stack/Stack.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { B: () => Stack });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          get_size =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
            )),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          ),
          classes = { root: "m_6d731127" };
        const defaultProps = {
            gap: "md",
            align: "stretch",
            justify: "flex-start",
          },
          varsResolver = (0, create_vars_resolver.V)(
            (_, { gap, align, justify }) => ({
              root: {
                "--stack-gap": (0, get_size.GY)(gap),
                "--stack-align": align,
                "--stack-justify": justify,
              },
            }),
          ),
          Stack = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)("Stack", defaultProps, _props),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                align,
                justify,
                gap,
                variant,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: "Stack",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ref,
              ...getStyles("root"),
              variant,
              ...others,
            });
          });
        (Stack.classes = classes), (Stack.displayName = "@mantine/core/Stack");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Text/Text.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { E: () => Text });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          get_size =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
            )),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          get_theme_color = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/color-functions/get-theme-color/get-theme-color.mjs",
          ),
          get_gradient = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/color-functions/get-gradient/get-gradient.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          ),
          classes = { root: "m_b6d8b162" };
        function getTextTruncate(truncate) {
          return "start" === truncate
            ? "start"
            : "end" === truncate || truncate
              ? "end"
              : void 0;
        }
        const defaultProps = { inherit: !1 },
          varsResolver = (0, create_vars_resolver.V)(
            (theme, { variant, lineClamp, gradient, size, color }) => ({
              root: {
                "--text-fz": (0, get_size.ny)(size),
                "--text-lh": (0, get_size.ks)(size),
                "--text-gradient":
                  "gradient" === variant
                    ? (0, get_gradient.v)(gradient, theme)
                    : void 0,
                "--text-line-clamp":
                  "number" == typeof lineClamp ? lineClamp.toString() : void 0,
                "--text-color": color
                  ? (0, get_theme_color.r)(color, theme)
                  : void 0,
              },
            }),
          ),
          Text = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)("Text", defaultProps, _props),
              {
                lineClamp,
                truncate,
                inline,
                inherit,
                gradient,
                span,
                __staticSelector,
                vars,
                className,
                style,
                classNames,
                styles,
                unstyled,
                variant,
                mod,
                size,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: ["Text", __staticSelector],
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("root", { focusable: !0 }),
              ref,
              component: span ? "span" : "p",
              variant,
              mod: [
                {
                  "data-truncate": getTextTruncate(truncate),
                  "data-line-clamp": "number" == typeof lineClamp,
                  "data-inline": inline,
                  "data-inherit": inherit,
                },
                mod,
              ],
              size,
              ...others,
            });
          });
        (Text.classes = classes), (Text.displayName = "@mantine/core/Text");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/TextInput/TextInput.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { k: () => TextInput });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          ),
          rem = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/units-converters/rem.mjs",
          ),
          get_size = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
          ),
          create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          extract_style_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/style-props/extract-style-props/extract-style-props.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          );
        function createOptionalContext(initialValue = null) {
          const Context = (0, react.createContext)(initialValue);
          return [
            ({ children, value }) =>
              (0, jsx_runtime.jsx)(Context.Provider, { value, children }),
            () => (0, react.useContext)(Context),
          ];
        }
        const [InputContext, useInputContext] = createOptionalContext({
          size: "sm",
        });
        var MantineThemeProvider = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
          ),
          resolve_class_names = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/get-class-name/resolve-class-names/resolve-class-names.mjs",
          ),
          resolve_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/get-style/resolve-styles/resolve-styles.mjs",
          );
        var UnstyledButton = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/UnstyledButton/UnstyledButton.mjs",
        );
        const CloseIcon = (0, react.forwardRef)(
          ({ size = "var(--cb-icon-size, 70%)", style, ...others }, ref) =>
            (0, jsx_runtime.jsx)("svg", {
              viewBox: "0 0 15 15",
              fill: "none",
              xmlns: "http://www.w3.org/2000/svg",
              style: { ...style, width: size, height: size },
              ref,
              ...others,
              children: (0, jsx_runtime.jsx)("path", {
                d: "M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z",
                fill: "currentColor",
                fillRule: "evenodd",
                clipRule: "evenodd",
              }),
            }),
        );
        CloseIcon.displayName = "@mantine/core/CloseIcon";
        var classes = { root: "m_86a44da5", "root--subtle": "m_220c80f2" };
        const defaultProps = { variant: "subtle" },
          varsResolver = (0, create_vars_resolver.V)(
            (_, { size, radius, iconSize }) => ({
              root: {
                "--cb-size": (0, get_size.YC)(size, "cb-size"),
                "--cb-radius":
                  void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                "--cb-icon-size": (0, rem.D)(iconSize),
              },
            }),
          ),
          CloseButton = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)("CloseButton", defaultProps, _props),
              {
                iconSize,
                children,
                vars,
                radius,
                className,
                classNames,
                style,
                styles,
                unstyled,
                "data-disabled": dataDisabled,
                disabled,
                variant,
                icon,
                mod,
                __staticSelector,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: __staticSelector || "CloseButton",
                props,
                className,
                style,
                classes,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver,
              });
            return (0, jsx_runtime.jsxs)(UnstyledButton.N, {
              ref,
              ...others,
              unstyled,
              variant,
              disabled,
              mod: [{ disabled: disabled || dataDisabled }, mod],
              ...getStyles("root", {
                variant,
                active: !disabled && !dataDisabled,
              }),
              children: [icon || (0, jsx_runtime.jsx)(CloseIcon, {}), children],
            });
          });
        (CloseButton.classes = classes),
          (CloseButton.displayName = "@mantine/core/CloseButton");
        const InputClearButton_defaultProps = {},
          InputClearButton = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "InputClearButton",
                InputClearButton_defaultProps,
                _props,
              ),
              { size, variant, vars, classNames, styles, ...others } = props,
              ctx = useInputContext(),
              { resolvedClassNames, resolvedStyles } =
                (function useResolvedStylesApi({
                  classNames,
                  styles,
                  props,
                  stylesCtx,
                }) {
                  const theme = (0, MantineThemeProvider.xd)();
                  return {
                    resolvedClassNames: (0, resolve_class_names.J)({
                      theme,
                      classNames,
                      props,
                      stylesCtx: stylesCtx || void 0,
                    }),
                    resolvedStyles: (0, resolve_styles.N)({
                      theme,
                      styles,
                      props,
                      stylesCtx: stylesCtx || void 0,
                    }),
                  };
                })({ classNames, styles, props });
            return (0, jsx_runtime.jsx)(CloseButton, {
              variant: variant || "transparent",
              ref,
              size: size || ctx?.size || "sm",
              classNames: resolvedClassNames,
              styles: resolvedStyles,
              __staticSelector: "InputClearButton",
              ...others,
            });
          });
        InputClearButton.displayName = "@mantine/core/InputClearButton";
        const [InputWrapperProvider, useInputWrapperContext] =
          createOptionalContext({
            offsetBottom: !1,
            offsetTop: !1,
            describedBy: void 0,
            getStyles: null,
            inputId: void 0,
            labelId: void 0,
          });
        var Input_module_css_classes = {
          wrapper: "m_6c018570",
          input: "m_8fb7ebe7",
          section: "m_82577fc2",
          placeholder: "m_88bacfd0",
          root: "m_46b77525",
          label: "m_8fdc1311",
          required: "m_78a94662",
          error: "m_8f816625",
          description: "m_fe47ce59",
        };
        const InputDescription_defaultProps = {},
          InputDescription_varsResolver = (0, create_vars_resolver.V)(
            (_, { size }) => ({
              description: {
                "--input-description-size":
                  void 0 === size
                    ? void 0
                    : `calc(${(0, get_size.ny)(size)} - ${(0, rem.D)(2)})`,
              },
            }),
          ),
          InputDescription = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "InputDescription",
                InputDescription_defaultProps,
                _props,
              ),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                size,
                __staticSelector,
                __inheritStyles = !0,
                variant,
                ...others
              } = (0, use_props.Y)(
                "InputDescription",
                InputDescription_defaultProps,
                props,
              ),
              ctx = useInputWrapperContext(),
              _getStyles = (0, use_styles.I)({
                name: ["InputWrapper", __staticSelector],
                props,
                classes: Input_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                rootSelector: "description",
                vars,
                varsResolver: InputDescription_varsResolver,
              }),
              getStyles = (__inheritStyles && ctx?.getStyles) || _getStyles;
            return (0, jsx_runtime.jsx)(Box.a, {
              component: "p",
              ref,
              variant,
              size,
              ...getStyles(
                "description",
                ctx?.getStyles ? { className, style } : void 0,
              ),
              ...others,
            });
          });
        (InputDescription.classes = Input_module_css_classes),
          (InputDescription.displayName = "@mantine/core/InputDescription");
        const InputError_defaultProps = {},
          InputError_varsResolver = (0, create_vars_resolver.V)(
            (_, { size }) => ({
              error: {
                "--input-error-size":
                  void 0 === size
                    ? void 0
                    : `calc(${(0, get_size.ny)(size)} - ${(0, rem.D)(2)})`,
              },
            }),
          ),
          InputError = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "InputError",
                InputError_defaultProps,
                _props,
              ),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                size,
                __staticSelector,
                __inheritStyles = !0,
                variant,
                ...others
              } = props,
              _getStyles = (0, use_styles.I)({
                name: ["InputWrapper", __staticSelector],
                props,
                classes: Input_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                rootSelector: "error",
                vars,
                varsResolver: InputError_varsResolver,
              }),
              ctx = useInputWrapperContext(),
              getStyles = (__inheritStyles && ctx?.getStyles) || _getStyles;
            return (0, jsx_runtime.jsx)(Box.a, {
              component: "p",
              ref,
              variant,
              size,
              ...getStyles(
                "error",
                ctx?.getStyles ? { className, style } : void 0,
              ),
              ...others,
            });
          });
        (InputError.classes = Input_module_css_classes),
          (InputError.displayName = "@mantine/core/InputError");
        const InputLabel_defaultProps = { labelElement: "label" },
          InputLabel_varsResolver = (0, create_vars_resolver.V)(
            (_, { size }) => ({
              label: {
                "--input-label-size": (0, get_size.ny)(size),
                "--input-asterisk-color": void 0,
              },
            }),
          ),
          InputLabel = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "InputLabel",
                InputLabel_defaultProps,
                _props,
              ),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                labelElement,
                size,
                required,
                htmlFor,
                onMouseDown,
                children,
                __staticSelector,
                variant,
                mod,
                ...others
              } = (0, use_props.Y)(
                "InputLabel",
                InputLabel_defaultProps,
                props,
              ),
              _getStyles = (0, use_styles.I)({
                name: ["InputWrapper", __staticSelector],
                props,
                classes: Input_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                rootSelector: "label",
                vars,
                varsResolver: InputLabel_varsResolver,
              }),
              ctx = useInputWrapperContext(),
              getStyles = ctx?.getStyles || _getStyles;
            return (0, jsx_runtime.jsxs)(Box.a, {
              ...getStyles(
                "label",
                ctx?.getStyles ? { className, style } : void 0,
              ),
              component: labelElement,
              variant,
              size,
              ref,
              htmlFor: "label" === labelElement ? htmlFor : void 0,
              mod: [{ required }, mod],
              onMouseDown: (event) => {
                onMouseDown?.(event),
                  !event.defaultPrevented &&
                    event.detail > 1 &&
                    event.preventDefault();
              },
              ...others,
              children: [
                children,
                required &&
                  (0, jsx_runtime.jsx)("span", {
                    ...getStyles("required"),
                    "aria-hidden": !0,
                    children: " *",
                  }),
              ],
            });
          });
        (InputLabel.classes = Input_module_css_classes),
          (InputLabel.displayName = "@mantine/core/InputLabel");
        const InputPlaceholder_defaultProps = {},
          InputPlaceholder = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "InputPlaceholder",
                InputPlaceholder_defaultProps,
                _props,
              ),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                __staticSelector,
                variant,
                error,
                mod,
                ...others
              } = (0, use_props.Y)(
                "InputPlaceholder",
                InputPlaceholder_defaultProps,
                props,
              ),
              getStyles = (0, use_styles.I)({
                name: ["InputPlaceholder", __staticSelector],
                props,
                classes: Input_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                rootSelector: "placeholder",
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("placeholder"),
              mod: [{ error: !!error }, mod],
              component: "span",
              variant,
              ref,
              ...others,
            });
          });
        (InputPlaceholder.classes = Input_module_css_classes),
          (InputPlaceholder.displayName = "@mantine/core/InputPlaceholder");
        var use_id = __webpack_require__(
          "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-id/use-id.mjs",
        );
        function getInputOffsets(
          inputWrapperOrder,
          { hasDescription, hasError },
        ) {
          const inputIndex = inputWrapperOrder.findIndex(
              (part) => "input" === part,
            ),
            aboveInput = inputWrapperOrder.slice(0, inputIndex),
            belowInput = inputWrapperOrder.slice(inputIndex + 1),
            offsetTop =
              (hasDescription && aboveInput.includes("description")) ||
              (hasError && aboveInput.includes("error"));
          return {
            offsetBottom:
              (hasDescription && belowInput.includes("description")) ||
              (hasError && belowInput.includes("error")),
            offsetTop,
          };
        }
        const InputWrapper_defaultProps = {
            labelElement: "label",
            inputContainer: (children) => children,
            inputWrapperOrder: ["label", "description", "input", "error"],
          },
          InputWrapper_varsResolver = (0, create_vars_resolver.V)(
            (_, { size }) => ({
              label: {
                "--input-label-size": (0, get_size.ny)(size),
                "--input-asterisk-color": void 0,
              },
              error: {
                "--input-error-size":
                  void 0 === size
                    ? void 0
                    : `calc(${(0, get_size.ny)(size)} - ${(0, rem.D)(2)})`,
              },
              description: {
                "--input-description-size":
                  void 0 === size
                    ? void 0
                    : `calc(${(0, get_size.ny)(size)} - ${(0, rem.D)(2)})`,
              },
            }),
          ),
          InputWrapper = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "InputWrapper",
                InputWrapper_defaultProps,
                _props,
              ),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                vars,
                size,
                variant,
                __staticSelector,
                inputContainer,
                inputWrapperOrder,
                label,
                error,
                description,
                labelProps,
                descriptionProps,
                errorProps,
                labelElement,
                children,
                withAsterisk,
                id,
                required,
                __stylesApiProps,
                mod,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: ["InputWrapper", __staticSelector],
                props: __stylesApiProps || props,
                classes: Input_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                vars,
                varsResolver: InputWrapper_varsResolver,
              }),
              sharedProps = { size, variant, __staticSelector },
              idBase = (0, use_id.B)(id),
              isRequired =
                "boolean" == typeof withAsterisk ? withAsterisk : required,
              errorId = errorProps?.id || `${idBase}-error`,
              descriptionId = descriptionProps?.id || `${idBase}-description`,
              inputId = idBase,
              hasError = !!error && "boolean" != typeof error,
              hasDescription = !!description,
              _describedBy = `${hasError ? errorId : ""} ${hasDescription ? descriptionId : ""}`,
              describedBy =
                _describedBy.trim().length > 0 ? _describedBy.trim() : void 0,
              labelId = labelProps?.id || `${idBase}-label`,
              _label =
                label &&
                (0, jsx_runtime.jsx)(
                  InputLabel,
                  {
                    labelElement,
                    id: labelId,
                    htmlFor: inputId,
                    required: isRequired,
                    ...sharedProps,
                    ...labelProps,
                    children: label,
                  },
                  "label",
                ),
              _description =
                hasDescription &&
                (0, jsx_runtime.jsx)(
                  InputDescription,
                  {
                    ...descriptionProps,
                    ...sharedProps,
                    size: descriptionProps?.size || sharedProps.size,
                    id: descriptionProps?.id || descriptionId,
                    children: description,
                  },
                  "description",
                ),
              _input = (0, jsx_runtime.jsx)(
                react.Fragment,
                { children: inputContainer(children) },
                "input",
              ),
              _error =
                hasError &&
                (0, react.createElement)(
                  InputError,
                  {
                    ...errorProps,
                    ...sharedProps,
                    size: errorProps?.size || sharedProps.size,
                    key: "error",
                    id: errorProps?.id || errorId,
                  },
                  error,
                ),
              content = inputWrapperOrder.map((part) => {
                switch (part) {
                  case "label":
                    return _label;
                  case "input":
                    return _input;
                  case "description":
                    return _description;
                  case "error":
                    return _error;
                  default:
                    return null;
                }
              });
            return (0, jsx_runtime.jsx)(InputWrapperProvider, {
              value: {
                getStyles,
                describedBy,
                inputId,
                labelId,
                ...getInputOffsets(inputWrapperOrder, {
                  hasDescription,
                  hasError,
                }),
              },
              children: (0, jsx_runtime.jsx)(Box.a, {
                ref,
                variant,
                size,
                mod: [{ error: !!error }, mod],
                ...getStyles("root"),
                ...others,
                children: content,
              }),
            });
          });
        (InputWrapper.classes = Input_module_css_classes),
          (InputWrapper.displayName = "@mantine/core/InputWrapper");
        const Input_defaultProps = {
            variant: "default",
            leftSectionPointerEvents: "none",
            rightSectionPointerEvents: "none",
            withAria: !0,
            withErrorStyles: !0,
          },
          Input_varsResolver = (0, create_vars_resolver.V)((_, props, ctx) => ({
            wrapper: {
              "--input-margin-top": ctx.offsetTop
                ? "calc(var(--mantine-spacing-xs) / 2)"
                : void 0,
              "--input-margin-bottom": ctx.offsetBottom
                ? "calc(var(--mantine-spacing-xs) / 2)"
                : void 0,
              "--input-height": (0, get_size.YC)(props.size, "input-height"),
              "--input-fz": (0, get_size.ny)(props.size),
              "--input-radius":
                void 0 === props.radius
                  ? void 0
                  : (0, get_size.nJ)(props.radius),
              "--input-left-section-width":
                void 0 !== props.leftSectionWidth
                  ? (0, rem.D)(props.leftSectionWidth)
                  : void 0,
              "--input-right-section-width":
                void 0 !== props.rightSectionWidth
                  ? (0, rem.D)(props.rightSectionWidth)
                  : void 0,
              "--input-padding-y": props.multiline
                ? (0, get_size.YC)(props.size, "input-padding-y")
                : void 0,
              "--input-left-section-pointer-events":
                props.leftSectionPointerEvents,
              "--input-right-section-pointer-events":
                props.rightSectionPointerEvents,
            },
          })),
          Input = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)("Input", Input_defaultProps, _props),
              {
                classNames,
                className,
                style,
                styles,
                unstyled,
                required,
                __staticSelector,
                __stylesApiProps,
                size,
                wrapperProps,
                error,
                disabled,
                leftSection,
                leftSectionProps,
                leftSectionWidth,
                rightSection,
                rightSectionProps,
                rightSectionWidth,
                rightSectionPointerEvents,
                leftSectionPointerEvents,
                variant,
                vars,
                pointer,
                multiline,
                radius,
                id,
                withAria,
                withErrorStyles,
                mod,
                inputSize,
                __clearSection,
                __clearable,
                __defaultRightSection,
                ...others
              } = props,
              { styleProps, rest } = (0, extract_style_props.j)(others),
              ctx = useInputWrapperContext(),
              stylesCtx = {
                offsetBottom: ctx?.offsetBottom,
                offsetTop: ctx?.offsetTop,
              },
              getStyles = (0, use_styles.I)({
                name: ["Input", __staticSelector],
                props: __stylesApiProps || props,
                classes: Input_module_css_classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                stylesCtx,
                rootSelector: "wrapper",
                vars,
                varsResolver: Input_varsResolver,
              }),
              ariaAttributes = withAria
                ? {
                    required,
                    disabled,
                    "aria-invalid": !!error,
                    "aria-describedby": ctx?.describedBy,
                    id: ctx?.inputId || id,
                  }
                : {},
              _rightSection =
                rightSection ||
                (__clearable && __clearSection) ||
                __defaultRightSection;
            return (0, jsx_runtime.jsx)(InputContext, {
              value: { size: size || "sm" },
              children: (0, jsx_runtime.jsxs)(Box.a, {
                ...getStyles("wrapper"),
                ...styleProps,
                ...wrapperProps,
                mod: [
                  {
                    error: !!error && withErrorStyles,
                    pointer,
                    disabled,
                    multiline,
                    "data-with-right-section": !!_rightSection,
                    "data-with-left-section": !!leftSection,
                  },
                  mod,
                ],
                variant,
                size,
                children: [
                  leftSection &&
                    (0, jsx_runtime.jsx)("div", {
                      ...leftSectionProps,
                      "data-position": "left",
                      ...getStyles("section", {
                        className: leftSectionProps?.className,
                        style: leftSectionProps?.style,
                      }),
                      children: leftSection,
                    }),
                  (0, jsx_runtime.jsx)(Box.a, {
                    component: "input",
                    ...rest,
                    ...ariaAttributes,
                    ref,
                    required,
                    mod: { disabled, error: !!error && withErrorStyles },
                    variant,
                    __size: inputSize,
                    ...getStyles("input"),
                  }),
                  _rightSection &&
                    (0, jsx_runtime.jsx)("div", {
                      ...rightSectionProps,
                      "data-position": "right",
                      ...getStyles("section", {
                        className: rightSectionProps?.className,
                        style: rightSectionProps?.style,
                      }),
                      children: _rightSection,
                    }),
                ],
              }),
            });
          });
        (Input.classes = Input_module_css_classes),
          (Input.Wrapper = InputWrapper),
          (Input.Label = InputLabel),
          (Input.Error = InputError),
          (Input.Description = InputDescription),
          (Input.Placeholder = InputPlaceholder),
          (Input.ClearButton = InputClearButton),
          (Input.displayName = "@mantine/core/Input");
        const InputBase_defaultProps = {
            __staticSelector: "InputBase",
            withAria: !0,
          },
          InputBase = (0, polymorphic_factory.v)((props, ref) => {
            const { inputProps, wrapperProps, ...others } =
              (function useInputProps(component, defaultProps, _props) {
                const props = (0, use_props.Y)(component, defaultProps, _props),
                  {
                    label,
                    description,
                    error,
                    required,
                    classNames,
                    styles,
                    className,
                    unstyled,
                    __staticSelector,
                    __stylesApiProps,
                    errorProps,
                    labelProps,
                    descriptionProps,
                    wrapperProps: _wrapperProps,
                    id,
                    size,
                    style,
                    inputContainer,
                    inputWrapperOrder,
                    withAsterisk,
                    variant,
                    vars,
                    mod,
                    ...others
                  } = props,
                  { styleProps, rest } = (0, extract_style_props.j)(others);
                return {
                  ...rest,
                  classNames,
                  styles,
                  unstyled,
                  wrapperProps: {
                    ...{
                      label,
                      description,
                      error,
                      required,
                      classNames,
                      className,
                      __staticSelector,
                      __stylesApiProps: __stylesApiProps || props,
                      errorProps,
                      labelProps,
                      descriptionProps,
                      unstyled,
                      styles,
                      size,
                      style,
                      inputContainer,
                      inputWrapperOrder,
                      withAsterisk,
                      variant,
                      id,
                      mod,
                      ..._wrapperProps,
                    },
                    ...styleProps,
                  },
                  inputProps: {
                    required,
                    classNames,
                    styles,
                    unstyled,
                    size,
                    __staticSelector,
                    __stylesApiProps: __stylesApiProps || props,
                    error,
                    variant,
                    id,
                  },
                };
              })("InputBase", InputBase_defaultProps, props);
            return (0, jsx_runtime.jsx)(Input.Wrapper, {
              ...wrapperProps,
              children: (0, jsx_runtime.jsx)(Input, {
                ...inputProps,
                ...others,
                ref,
              }),
            });
          });
        (InputBase.classes = { ...Input.classes, ...Input.Wrapper.classes }),
          (InputBase.displayName = "@mantine/core/InputBase");
        const TextInput_defaultProps = {},
          TextInput = (0, factory.P9)((props, ref) => {
            const _props = (0, use_props.Y)(
              "TextInput",
              TextInput_defaultProps,
              props,
            );
            return (0, jsx_runtime.jsx)(InputBase, {
              component: "input",
              ref,
              ..._props,
              __staticSelector: "TextInput",
            });
          });
        (TextInput.classes = InputBase.classes),
          (TextInput.displayName = "@mantine/core/TextInput");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Tooltip/Tooltip.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { m: () => Tooltip });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          react_namespaceObject = __webpack_require__.t(react, 2),
          clsx = __webpack_require__(
            "./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs",
          );
        function assignRef(ref, value) {
          if ("function" == typeof ref) return ref(value);
          "object" == typeof ref &&
            null !== ref &&
            "current" in ref &&
            (ref.current = value);
        }
        function useMergedRef(...refs) {
          return (0, react.useCallback)(
            (function mergeRefs(...refs) {
              const cleanupMap = new Map();
              return (node) => {
                if (
                  (refs.forEach((ref) => {
                    const cleanup = assignRef(ref, node);
                    cleanup && cleanupMap.set(ref, cleanup);
                  }),
                  cleanupMap.size > 0)
                )
                  return () => {
                    refs.forEach((ref) => {
                      const cleanup = cleanupMap.get(ref);
                      cleanup ? cleanup() : assignRef(ref, null);
                    }),
                      cleanupMap.clear();
                  };
              };
            })(...refs),
            refs,
          );
        }
        function is_element_isElement(value) {
          return (
            !Array.isArray(value) &&
            null !== value &&
            "object" == typeof value &&
            value.type !== react.Fragment
          );
        }
        const elevations = {
          app: 100,
          modal: 200,
          popover: 300,
          overlay: 400,
          max: 9999,
        };
        function getDefaultZIndex(level) {
          return elevations[level];
        }
        var get_size = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs",
        );
        function getRefProp(element) {
          const version = react.version;
          return "string" != typeof react.version || version.startsWith("18.")
            ? element?.ref
            : element?.props?.ref;
        }
        var create_vars_resolver = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs",
          ),
          get_theme_color = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/color-functions/get-theme-color/get-theme-color.mjs",
          ),
          use_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
          ),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          );
        const DirectionContext = (0, react.createContext)({
          dir: "ltr",
          toggleDirection: () => {},
          setDirection: () => {},
        });
        function useDirection() {
          return (0, react.useContext)(DirectionContext);
        }
        function getFloatingPosition(dir, position) {
          if (
            "rtl" === dir &&
            (position.includes("right") || position.includes("left"))
          ) {
            const [side, placement] = position.split("-"),
              flippedPosition = "right" === side ? "left" : "right";
            return void 0 === placement
              ? flippedPosition
              : `${flippedPosition}-${placement}`;
          }
          return position;
        }
        function horizontalSide(placement, arrowY, arrowOffset, arrowPosition) {
          return "center" === placement || "center" === arrowPosition
            ? { top: arrowY }
            : "end" === placement
              ? { bottom: arrowOffset }
              : "start" === placement
                ? { top: arrowOffset }
                : {};
        }
        function verticalSide(
          placement,
          arrowX,
          arrowOffset,
          arrowPosition,
          dir,
        ) {
          return "center" === placement || "center" === arrowPosition
            ? { left: arrowX }
            : "end" === placement
              ? { ["ltr" === dir ? "right" : "left"]: arrowOffset }
              : "start" === placement
                ? { ["ltr" === dir ? "left" : "right"]: arrowOffset }
                : {};
        }
        const radiusByFloatingSide = {
          bottom: "borderTopLeftRadius",
          left: "borderTopRightRadius",
          right: "borderBottomLeftRadius",
          top: "borderBottomRightRadius",
        };
        function getArrowPositionStyles({
          position,
          arrowSize,
          arrowOffset,
          arrowRadius,
          arrowPosition,
          arrowX,
          arrowY,
          dir,
        }) {
          const [side, placement = "center"] = position.split("-"),
            baseStyles = {
              width: arrowSize,
              height: arrowSize,
              transform: "rotate(45deg)",
              position: "absolute",
              [radiusByFloatingSide[side]]: arrowRadius,
            },
            arrowPlacement = -arrowSize / 2;
          return "left" === side
            ? {
                ...baseStyles,
                ...horizontalSide(
                  placement,
                  arrowY,
                  arrowOffset,
                  arrowPosition,
                ),
                right: arrowPlacement,
                borderLeftColor: "transparent",
                borderBottomColor: "transparent",
                clipPath: "polygon(100% 0, 0 0, 100% 100%)",
              }
            : "right" === side
              ? {
                  ...baseStyles,
                  ...horizontalSide(
                    placement,
                    arrowY,
                    arrowOffset,
                    arrowPosition,
                  ),
                  left: arrowPlacement,
                  borderRightColor: "transparent",
                  borderTopColor: "transparent",
                  clipPath: "polygon(0 100%, 0 0, 100% 100%)",
                }
              : "top" === side
                ? {
                    ...baseStyles,
                    ...verticalSide(
                      placement,
                      arrowX,
                      arrowOffset,
                      arrowPosition,
                      dir,
                    ),
                    bottom: arrowPlacement,
                    borderTopColor: "transparent",
                    borderLeftColor: "transparent",
                    clipPath: "polygon(0 100%, 100% 100%, 100% 0)",
                  }
                : "bottom" === side
                  ? {
                      ...baseStyles,
                      ...verticalSide(
                        placement,
                        arrowX,
                        arrowOffset,
                        arrowPosition,
                        dir,
                      ),
                      top: arrowPlacement,
                      borderBottomColor: "transparent",
                      borderRightColor: "transparent",
                      clipPath: "polygon(0 100%, 0 0, 100% 0)",
                    }
                  : {};
        }
        const FloatingArrow = (0, react.forwardRef)(
          (
            {
              position,
              arrowSize,
              arrowOffset,
              arrowRadius,
              arrowPosition,
              visible,
              arrowX,
              arrowY,
              style,
              ...others
            },
            ref,
          ) => {
            const { dir } = useDirection();
            return visible
              ? (0, jsx_runtime.jsx)("div", {
                  ...others,
                  ref,
                  style: {
                    ...style,
                    ...getArrowPositionStyles({
                      position,
                      arrowSize,
                      arrowOffset,
                      arrowRadius,
                      arrowPosition,
                      dir,
                      arrowX,
                      arrowY,
                    }),
                  },
                })
              : null;
          },
        );
        FloatingArrow.displayName = "@mantine/core/FloatingArrow";
        var Mantine_context = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs",
          ),
          react_dom = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react-dom/index.js",
          ),
          use_isomorphic_effect = __webpack_require__(
            "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-isomorphic-effect/use-isomorphic-effect.mjs",
          );
        function createPortalNode(props) {
          const node = document.createElement("div");
          return (
            node.setAttribute("data-portal", "true"),
            "string" == typeof props.className &&
              node.classList.add(...props.className.split(" ").filter(Boolean)),
            "object" == typeof props.style &&
              Object.assign(node.style, props.style),
            "string" == typeof props.id && node.setAttribute("id", props.id),
            node
          );
        }
        const defaultProps = {},
          Portal = (0, factory.P9)((props, ref) => {
            const { children, target, reuseTargetNode, ...others } = (0,
              use_props.Y)("Portal", defaultProps, props),
              [mounted, setMounted] = (0, react.useState)(!1),
              nodeRef = (0, react.useRef)(null);
            return (
              (0, use_isomorphic_effect.o)(
                () => (
                  setMounted(!0),
                  (nodeRef.current = (function getTargetNode({
                    target,
                    reuseTargetNode,
                    ...others
                  }) {
                    if (target)
                      return "string" == typeof target
                        ? document.querySelector(target) ||
                            createPortalNode(others)
                        : target;
                    if (reuseTargetNode) {
                      const existingNode = document.querySelector(
                        "[data-mantine-shared-portal-node]",
                      );
                      if (existingNode) return existingNode;
                      const node = createPortalNode(others);
                      return (
                        node.setAttribute(
                          "data-mantine-shared-portal-node",
                          "true",
                        ),
                        document.body.appendChild(node),
                        node
                      );
                    }
                    return createPortalNode(others);
                  })({ target, reuseTargetNode, ...others })),
                  assignRef(ref, nodeRef.current),
                  target ||
                    reuseTargetNode ||
                    !nodeRef.current ||
                    document.body.appendChild(nodeRef.current),
                  () => {
                    target ||
                      reuseTargetNode ||
                      !nodeRef.current ||
                      document.body.removeChild(nodeRef.current);
                  }
                ),
                [target],
              ),
              mounted && nodeRef.current
                ? (0, react_dom.createPortal)(
                    (0, jsx_runtime.jsx)(jsx_runtime.Fragment, { children }),
                    nodeRef.current,
                  )
                : null
            );
          });
        Portal.displayName = "@mantine/core/Portal";
        const OptionalPortal = (0, factory.P9)(
          ({ withinPortal = !0, children, ...others }, ref) =>
            "test" !== (0, Mantine_context.bv)() && withinPortal
              ? (0, jsx_runtime.jsx)(Portal, { ref, ...others, children })
              : (0, jsx_runtime.jsx)(jsx_runtime.Fragment, { children }),
        );
        OptionalPortal.displayName = "@mantine/core/OptionalPortal";
        var Transition = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Transition/Transition.mjs",
        );
        const defaultTransition = { duration: 100, transition: "fade" };
        var MantineThemeProvider = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
        );
        function getStyleObject(style, theme) {
          return Array.isArray(style)
            ? [...style].reduce(
                (acc, item) => ({ ...acc, ...getStyleObject(item, theme) }),
                {},
              )
            : "function" == typeof style
              ? style(theme)
              : null == style
                ? {}
                : style;
        }
        function hasWindow() {
          return "undefined" != typeof window;
        }
        function floating_ui_utils_dom_getNodeName(node) {
          return isNode(node)
            ? (node.nodeName || "").toLowerCase()
            : "#document";
        }
        function floating_ui_utils_dom_getWindow(node) {
          var _node$ownerDocument;
          return (
            (null == node || null == (_node$ownerDocument = node.ownerDocument)
              ? void 0
              : _node$ownerDocument.defaultView) || window
          );
        }
        function getDocumentElement(node) {
          var _ref;
          return null ==
            (_ref =
              (isNode(node) ? node.ownerDocument : node.document) ||
              window.document)
            ? void 0
            : _ref.documentElement;
        }
        function isNode(value) {
          return (
            !!hasWindow() &&
            (value instanceof Node ||
              value instanceof floating_ui_utils_dom_getWindow(value).Node)
          );
        }
        function floating_ui_utils_dom_isElement(value) {
          return (
            !!hasWindow() &&
            (value instanceof Element ||
              value instanceof floating_ui_utils_dom_getWindow(value).Element)
          );
        }
        function floating_ui_utils_dom_isHTMLElement(value) {
          return (
            !!hasWindow() &&
            (value instanceof HTMLElement ||
              value instanceof
                floating_ui_utils_dom_getWindow(value).HTMLElement)
          );
        }
        function isShadowRoot(value) {
          return (
            !(!hasWindow() || "undefined" == typeof ShadowRoot) &&
            (value instanceof ShadowRoot ||
              value instanceof
                floating_ui_utils_dom_getWindow(value).ShadowRoot)
          );
        }
        function isOverflowElement(element) {
          const { overflow, overflowX, overflowY, display } =
            floating_ui_utils_dom_getComputedStyle(element);
          return (
            /auto|scroll|overlay|hidden|clip/.test(
              overflow + overflowY + overflowX,
            ) && !["inline", "contents"].includes(display)
          );
        }
        function isTableElement(element) {
          return ["table", "td", "th"].includes(
            floating_ui_utils_dom_getNodeName(element),
          );
        }
        function isTopLayer(element) {
          return [":popover-open", ":modal"].some((selector) => {
            try {
              return element.matches(selector);
            } catch (e) {
              return !1;
            }
          });
        }
        function isContainingBlock(elementOrCss) {
          const webkit = isWebKit(),
            css = floating_ui_utils_dom_isElement(elementOrCss)
              ? floating_ui_utils_dom_getComputedStyle(elementOrCss)
              : elementOrCss;
          return (
            ["transform", "translate", "scale", "rotate", "perspective"].some(
              (value) => !!css[value] && "none" !== css[value],
            ) ||
            (!!css.containerType && "normal" !== css.containerType) ||
            (!webkit &&
              !!css.backdropFilter &&
              "none" !== css.backdropFilter) ||
            (!webkit && !!css.filter && "none" !== css.filter) ||
            [
              "transform",
              "translate",
              "scale",
              "rotate",
              "perspective",
              "filter",
            ].some((value) => (css.willChange || "").includes(value)) ||
            ["paint", "layout", "strict", "content"].some((value) =>
              (css.contain || "").includes(value),
            )
          );
        }
        function isWebKit() {
          return (
            !("undefined" == typeof CSS || !CSS.supports) &&
            CSS.supports("-webkit-backdrop-filter", "none")
          );
        }
        function isLastTraversableNode(node) {
          return ["html", "body", "#document"].includes(
            floating_ui_utils_dom_getNodeName(node),
          );
        }
        function floating_ui_utils_dom_getComputedStyle(element) {
          return floating_ui_utils_dom_getWindow(element).getComputedStyle(
            element,
          );
        }
        function getNodeScroll(element) {
          return floating_ui_utils_dom_isElement(element)
            ? { scrollLeft: element.scrollLeft, scrollTop: element.scrollTop }
            : { scrollLeft: element.scrollX, scrollTop: element.scrollY };
        }
        function getParentNode(node) {
          if ("html" === floating_ui_utils_dom_getNodeName(node)) return node;
          const result =
            node.assignedSlot ||
            node.parentNode ||
            (isShadowRoot(node) && node.host) ||
            getDocumentElement(node);
          return isShadowRoot(result) ? result.host : result;
        }
        function getNearestOverflowAncestor(node) {
          const parentNode = getParentNode(node);
          return isLastTraversableNode(parentNode)
            ? node.ownerDocument
              ? node.ownerDocument.body
              : node.body
            : floating_ui_utils_dom_isHTMLElement(parentNode) &&
                isOverflowElement(parentNode)
              ? parentNode
              : getNearestOverflowAncestor(parentNode);
        }
        function getOverflowAncestors(node, list, traverseIframes) {
          var _node$ownerDocument2;
          void 0 === list && (list = []),
            void 0 === traverseIframes && (traverseIframes = !0);
          const scrollableAncestor = getNearestOverflowAncestor(node),
            isBody =
              scrollableAncestor ===
              (null == (_node$ownerDocument2 = node.ownerDocument)
                ? void 0
                : _node$ownerDocument2.body),
            win = floating_ui_utils_dom_getWindow(scrollableAncestor);
          if (isBody) {
            const frameElement = getFrameElement(win);
            return list.concat(
              win,
              win.visualViewport || [],
              isOverflowElement(scrollableAncestor) ? scrollableAncestor : [],
              frameElement && traverseIframes
                ? getOverflowAncestors(frameElement)
                : [],
            );
          }
          return list.concat(
            scrollableAncestor,
            getOverflowAncestors(scrollableAncestor, [], traverseIframes),
          );
        }
        function getFrameElement(win) {
          return win.parent && Object.getPrototypeOf(win.parent)
            ? win.frameElement
            : null;
        }
        function floating_ui_react_utils_activeElement(doc) {
          let activeElement = doc.activeElement;
          for (
            ;
            null !=
            (null == (_activeElement = activeElement) ||
            null == (_activeElement = _activeElement.shadowRoot)
              ? void 0
              : _activeElement.activeElement);

          ) {
            var _activeElement;
            activeElement = activeElement.shadowRoot.activeElement;
          }
          return activeElement;
        }
        function floating_ui_react_utils_contains(parent, child) {
          if (!parent || !child) return !1;
          const rootNode =
            null == child.getRootNode ? void 0 : child.getRootNode();
          if (parent.contains(child)) return !0;
          if (rootNode && isShadowRoot(rootNode)) {
            let next = child;
            for (; next; ) {
              if (parent === next) return !0;
              next = next.parentNode || next.host;
            }
          }
          return !1;
        }
        function floating_ui_react_utils_getPlatform() {
          const uaData = navigator.userAgentData;
          return null != uaData && uaData.platform
            ? uaData.platform
            : navigator.platform;
        }
        function floating_ui_react_utils_getUserAgent() {
          const uaData = navigator.userAgentData;
          return uaData && Array.isArray(uaData.brands)
            ? uaData.brands
                .map((_ref) => {
                  let { brand, version } = _ref;
                  return brand + "/" + version;
                })
                .join(" ")
            : navigator.userAgent;
        }
        function floating_ui_react_utils_isVirtualPointerEvent(event) {
          return (
            !(function isJSDOM() {
              return floating_ui_react_utils_getUserAgent().includes("jsdom/");
            })() &&
            ((!isAndroid() && 0 === event.width && 0 === event.height) ||
              (isAndroid() &&
                1 === event.width &&
                1 === event.height &&
                0 === event.pressure &&
                0 === event.detail &&
                "mouse" === event.pointerType) ||
              (event.width < 1 &&
                event.height < 1 &&
                0 === event.pressure &&
                0 === event.detail &&
                "touch" === event.pointerType))
          );
        }
        function isAndroid() {
          const re = /android/i;
          return (
            re.test(floating_ui_react_utils_getPlatform()) ||
            re.test(floating_ui_react_utils_getUserAgent())
          );
        }
        function floating_ui_react_utils_isMouseLikePointerType(
          pointerType,
          strict,
        ) {
          const values = ["mouse", "pen"];
          return (
            strict || values.push("", void 0), values.includes(pointerType)
          );
        }
        function floating_ui_react_utils_getDocument(node) {
          return (null == node ? void 0 : node.ownerDocument) || document;
        }
        function isEventTargetWithin(event, node) {
          if (null == node) return !1;
          if ("composedPath" in event)
            return event.composedPath().includes(node);
          const e = event;
          return null != e.target && node.contains(e.target);
        }
        function floating_ui_react_utils_getTarget(event) {
          return "composedPath" in event
            ? event.composedPath()[0]
            : event.target;
        }
        function floating_ui_react_utils_isTypeableElement(element) {
          return (
            floating_ui_utils_dom_isHTMLElement(element) &&
            element.matches(
              "input:not([type='hidden']):not([disabled]),[contenteditable]:not([contenteditable='false']),textarea:not([disabled])",
            )
          );
        }
        const floating_ui_utils_min = Math.min,
          floating_ui_utils_max = Math.max,
          floating_ui_utils_round = Math.round,
          floating_ui_utils_floor = Math.floor,
          createCoords = (v) => ({ x: v, y: v }),
          oppositeSideMap = {
            left: "right",
            right: "left",
            bottom: "top",
            top: "bottom",
          },
          oppositeAlignmentMap = { start: "end", end: "start" };
        function clamp(start, value, end) {
          return floating_ui_utils_max(
            start,
            floating_ui_utils_min(value, end),
          );
        }
        function floating_ui_utils_evaluate(value, param) {
          return "function" == typeof value ? value(param) : value;
        }
        function floating_ui_utils_getSide(placement) {
          return placement.split("-")[0];
        }
        function floating_ui_utils_getAlignment(placement) {
          return placement.split("-")[1];
        }
        function floating_ui_utils_getOppositeAxis(axis) {
          return "x" === axis ? "y" : "x";
        }
        function getAxisLength(axis) {
          return "y" === axis ? "height" : "width";
        }
        function floating_ui_utils_getSideAxis(placement) {
          return ["top", "bottom"].includes(
            floating_ui_utils_getSide(placement),
          )
            ? "y"
            : "x";
        }
        function getAlignmentAxis(placement) {
          return floating_ui_utils_getOppositeAxis(
            floating_ui_utils_getSideAxis(placement),
          );
        }
        function floating_ui_utils_getOppositeAlignmentPlacement(placement) {
          return placement.replace(
            /start|end/g,
            (alignment) => oppositeAlignmentMap[alignment],
          );
        }
        function getOppositePlacement(placement) {
          return placement.replace(
            /left|right|bottom|top/g,
            (side) => oppositeSideMap[side],
          );
        }
        function getPaddingObject(padding) {
          return "number" != typeof padding
            ? (function expandPaddingObject(padding) {
                return { top: 0, right: 0, bottom: 0, left: 0, ...padding };
              })(padding)
            : { top: padding, right: padding, bottom: padding, left: padding };
        }
        function rectToClientRect(rect) {
          const { x, y, width, height } = rect;
          return {
            width,
            height,
            top: y,
            left: x,
            right: x + width,
            bottom: y + height,
            x,
            y,
          };
        }
        function computeCoordsFromPlacement(_ref, placement, rtl) {
          let { reference, floating } = _ref;
          const sideAxis = floating_ui_utils_getSideAxis(placement),
            alignmentAxis = getAlignmentAxis(placement),
            alignLength = getAxisLength(alignmentAxis),
            side = floating_ui_utils_getSide(placement),
            isVertical = "y" === sideAxis,
            commonX = reference.x + reference.width / 2 - floating.width / 2,
            commonY = reference.y + reference.height / 2 - floating.height / 2,
            commonAlign =
              reference[alignLength] / 2 - floating[alignLength] / 2;
          let coords;
          switch (side) {
            case "top":
              coords = { x: commonX, y: reference.y - floating.height };
              break;
            case "bottom":
              coords = { x: commonX, y: reference.y + reference.height };
              break;
            case "right":
              coords = { x: reference.x + reference.width, y: commonY };
              break;
            case "left":
              coords = { x: reference.x - floating.width, y: commonY };
              break;
            default:
              coords = { x: reference.x, y: reference.y };
          }
          switch (floating_ui_utils_getAlignment(placement)) {
            case "start":
              coords[alignmentAxis] -=
                commonAlign * (rtl && isVertical ? -1 : 1);
              break;
            case "end":
              coords[alignmentAxis] +=
                commonAlign * (rtl && isVertical ? -1 : 1);
          }
          return coords;
        }
        async function floating_ui_core_detectOverflow(state, options) {
          var _await$platform$isEle;
          void 0 === options && (options = {});
          const { x, y, platform, rects, elements, strategy } = state,
            {
              boundary = "clippingAncestors",
              rootBoundary = "viewport",
              elementContext = "floating",
              altBoundary = !1,
              padding = 0,
            } = floating_ui_utils_evaluate(options, state),
            paddingObject = getPaddingObject(padding),
            element =
              elements[
                altBoundary
                  ? "floating" === elementContext
                    ? "reference"
                    : "floating"
                  : elementContext
              ],
            clippingClientRect = rectToClientRect(
              await platform.getClippingRect({
                element:
                  null ==
                    (_await$platform$isEle = await (null == platform.isElement
                      ? void 0
                      : platform.isElement(element))) || _await$platform$isEle
                    ? element
                    : element.contextElement ||
                      (await (null == platform.getDocumentElement
                        ? void 0
                        : platform.getDocumentElement(elements.floating))),
                boundary,
                rootBoundary,
                strategy,
              }),
            ),
            rect =
              "floating" === elementContext
                ? {
                    x,
                    y,
                    width: rects.floating.width,
                    height: rects.floating.height,
                  }
                : rects.reference,
            offsetParent = await (null == platform.getOffsetParent
              ? void 0
              : platform.getOffsetParent(elements.floating)),
            offsetScale = ((await (null == platform.isElement
              ? void 0
              : platform.isElement(offsetParent))) &&
              (await (null == platform.getScale
                ? void 0
                : platform.getScale(offsetParent)))) || { x: 1, y: 1 },
            elementClientRect = rectToClientRect(
              platform.convertOffsetParentRelativeRectToViewportRelativeRect
                ? await platform.convertOffsetParentRelativeRectToViewportRelativeRect(
                    { elements, rect, offsetParent, strategy },
                  )
                : rect,
            );
          return {
            top:
              (clippingClientRect.top -
                elementClientRect.top +
                paddingObject.top) /
              offsetScale.y,
            bottom:
              (elementClientRect.bottom -
                clippingClientRect.bottom +
                paddingObject.bottom) /
              offsetScale.y,
            left:
              (clippingClientRect.left -
                elementClientRect.left +
                paddingObject.left) /
              offsetScale.x,
            right:
              (elementClientRect.right -
                clippingClientRect.right +
                paddingObject.right) /
              offsetScale.x,
          };
        }
        function getBoundingRect(rects) {
          const minX = floating_ui_utils_min(...rects.map((rect) => rect.left)),
            minY = floating_ui_utils_min(...rects.map((rect) => rect.top));
          return {
            x: minX,
            y: minY,
            width:
              floating_ui_utils_max(...rects.map((rect) => rect.right)) - minX,
            height:
              floating_ui_utils_max(...rects.map((rect) => rect.bottom)) - minY,
          };
        }
        function getCssDimensions(element) {
          const css = floating_ui_utils_dom_getComputedStyle(element);
          let width = parseFloat(css.width) || 0,
            height = parseFloat(css.height) || 0;
          const hasOffset = floating_ui_utils_dom_isHTMLElement(element),
            offsetWidth = hasOffset ? element.offsetWidth : width,
            offsetHeight = hasOffset ? element.offsetHeight : height,
            shouldFallback =
              floating_ui_utils_round(width) !== offsetWidth ||
              floating_ui_utils_round(height) !== offsetHeight;
          return (
            shouldFallback && ((width = offsetWidth), (height = offsetHeight)),
            { width, height, $: shouldFallback }
          );
        }
        function unwrapElement(element) {
          return floating_ui_utils_dom_isElement(element)
            ? element
            : element.contextElement;
        }
        function getScale(element) {
          const domElement = unwrapElement(element);
          if (!floating_ui_utils_dom_isHTMLElement(domElement))
            return createCoords(1);
          const rect = domElement.getBoundingClientRect(),
            { width, height, $ } = getCssDimensions(domElement);
          let x =
              ($ ? floating_ui_utils_round(rect.width) : rect.width) / width,
            y =
              ($ ? floating_ui_utils_round(rect.height) : rect.height) / height;
          return (
            (x && Number.isFinite(x)) || (x = 1),
            (y && Number.isFinite(y)) || (y = 1),
            { x, y }
          );
        }
        const noOffsets = createCoords(0);
        function getVisualOffsets(element) {
          const win = floating_ui_utils_dom_getWindow(element);
          return isWebKit() && win.visualViewport
            ? {
                x: win.visualViewport.offsetLeft,
                y: win.visualViewport.offsetTop,
              }
            : noOffsets;
        }
        function getBoundingClientRect(
          element,
          includeScale,
          isFixedStrategy,
          offsetParent,
        ) {
          void 0 === includeScale && (includeScale = !1),
            void 0 === isFixedStrategy && (isFixedStrategy = !1);
          const clientRect = element.getBoundingClientRect(),
            domElement = unwrapElement(element);
          let scale = createCoords(1);
          includeScale &&
            (offsetParent
              ? floating_ui_utils_dom_isElement(offsetParent) &&
                (scale = getScale(offsetParent))
              : (scale = getScale(element)));
          const visualOffsets = (function shouldAddVisualOffsets(
            element,
            isFixed,
            floatingOffsetParent,
          ) {
            return (
              void 0 === isFixed && (isFixed = !1),
              !(
                !floatingOffsetParent ||
                (isFixed &&
                  floatingOffsetParent !==
                    floating_ui_utils_dom_getWindow(element))
              ) && isFixed
            );
          })(domElement, isFixedStrategy, offsetParent)
            ? getVisualOffsets(domElement)
            : createCoords(0);
          let x = (clientRect.left + visualOffsets.x) / scale.x,
            y = (clientRect.top + visualOffsets.y) / scale.y,
            width = clientRect.width / scale.x,
            height = clientRect.height / scale.y;
          if (domElement) {
            const win = floating_ui_utils_dom_getWindow(domElement),
              offsetWin =
                offsetParent && floating_ui_utils_dom_isElement(offsetParent)
                  ? floating_ui_utils_dom_getWindow(offsetParent)
                  : offsetParent;
            let currentWin = win,
              currentIFrame = getFrameElement(currentWin);
            for (
              ;
              currentIFrame && offsetParent && offsetWin !== currentWin;

            ) {
              const iframeScale = getScale(currentIFrame),
                iframeRect = currentIFrame.getBoundingClientRect(),
                css = floating_ui_utils_dom_getComputedStyle(currentIFrame),
                left =
                  iframeRect.left +
                  (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) *
                    iframeScale.x,
                top =
                  iframeRect.top +
                  (currentIFrame.clientTop + parseFloat(css.paddingTop)) *
                    iframeScale.y;
              (x *= iframeScale.x),
                (y *= iframeScale.y),
                (width *= iframeScale.x),
                (height *= iframeScale.y),
                (x += left),
                (y += top),
                (currentWin = floating_ui_utils_dom_getWindow(currentIFrame)),
                (currentIFrame = getFrameElement(currentWin));
            }
          }
          return rectToClientRect({ width, height, x, y });
        }
        function getWindowScrollBarX(element, rect) {
          const leftScroll = getNodeScroll(element).scrollLeft;
          return rect
            ? rect.left + leftScroll
            : getBoundingClientRect(getDocumentElement(element)).left +
                leftScroll;
        }
        function getHTMLOffset(documentElement, scroll, ignoreScrollbarX) {
          void 0 === ignoreScrollbarX && (ignoreScrollbarX = !1);
          const htmlRect = documentElement.getBoundingClientRect();
          return {
            x:
              htmlRect.left +
              scroll.scrollLeft -
              (ignoreScrollbarX
                ? 0
                : getWindowScrollBarX(documentElement, htmlRect)),
            y: htmlRect.top + scroll.scrollTop,
          };
        }
        function getClientRectFromClippingAncestor(
          element,
          clippingAncestor,
          strategy,
        ) {
          let rect;
          if ("viewport" === clippingAncestor)
            rect = (function getViewportRect(element, strategy) {
              const win = floating_ui_utils_dom_getWindow(element),
                html = getDocumentElement(element),
                visualViewport = win.visualViewport;
              let width = html.clientWidth,
                height = html.clientHeight,
                x = 0,
                y = 0;
              if (visualViewport) {
                (width = visualViewport.width),
                  (height = visualViewport.height);
                const visualViewportBased = isWebKit();
                (!visualViewportBased ||
                  (visualViewportBased && "fixed" === strategy)) &&
                  ((x = visualViewport.offsetLeft),
                  (y = visualViewport.offsetTop));
              }
              return { width, height, x, y };
            })(element, strategy);
          else if ("document" === clippingAncestor)
            rect = (function getDocumentRect(element) {
              const html = getDocumentElement(element),
                scroll = getNodeScroll(element),
                body = element.ownerDocument.body,
                width = floating_ui_utils_max(
                  html.scrollWidth,
                  html.clientWidth,
                  body.scrollWidth,
                  body.clientWidth,
                ),
                height = floating_ui_utils_max(
                  html.scrollHeight,
                  html.clientHeight,
                  body.scrollHeight,
                  body.clientHeight,
                );
              let x = -scroll.scrollLeft + getWindowScrollBarX(element);
              const y = -scroll.scrollTop;
              return (
                "rtl" ===
                  floating_ui_utils_dom_getComputedStyle(body).direction &&
                  (x +=
                    floating_ui_utils_max(html.clientWidth, body.clientWidth) -
                    width),
                { width, height, x, y }
              );
            })(getDocumentElement(element));
          else if (floating_ui_utils_dom_isElement(clippingAncestor))
            rect = (function getInnerBoundingClientRect(element, strategy) {
              const clientRect = getBoundingClientRect(
                  element,
                  !0,
                  "fixed" === strategy,
                ),
                top = clientRect.top + element.clientTop,
                left = clientRect.left + element.clientLeft,
                scale = floating_ui_utils_dom_isHTMLElement(element)
                  ? getScale(element)
                  : createCoords(1);
              return {
                width: element.clientWidth * scale.x,
                height: element.clientHeight * scale.y,
                x: left * scale.x,
                y: top * scale.y,
              };
            })(clippingAncestor, strategy);
          else {
            const visualOffsets = getVisualOffsets(element);
            rect = {
              x: clippingAncestor.x - visualOffsets.x,
              y: clippingAncestor.y - visualOffsets.y,
              width: clippingAncestor.width,
              height: clippingAncestor.height,
            };
          }
          return rectToClientRect(rect);
        }
        function hasFixedPositionAncestor(element, stopNode) {
          const parentNode = getParentNode(element);
          return (
            !(
              parentNode === stopNode ||
              !floating_ui_utils_dom_isElement(parentNode) ||
              isLastTraversableNode(parentNode)
            ) &&
            ("fixed" ===
              floating_ui_utils_dom_getComputedStyle(parentNode).position ||
              hasFixedPositionAncestor(parentNode, stopNode))
          );
        }
        function getRectRelativeToOffsetParent(
          element,
          offsetParent,
          strategy,
        ) {
          const isOffsetParentAnElement =
              floating_ui_utils_dom_isHTMLElement(offsetParent),
            documentElement = getDocumentElement(offsetParent),
            isFixed = "fixed" === strategy,
            rect = getBoundingClientRect(element, !0, isFixed, offsetParent);
          let scroll = { scrollLeft: 0, scrollTop: 0 };
          const offsets = createCoords(0);
          if (isOffsetParentAnElement || (!isOffsetParentAnElement && !isFixed))
            if (
              (("body" !== floating_ui_utils_dom_getNodeName(offsetParent) ||
                isOverflowElement(documentElement)) &&
                (scroll = getNodeScroll(offsetParent)),
              isOffsetParentAnElement)
            ) {
              const offsetRect = getBoundingClientRect(
                offsetParent,
                !0,
                isFixed,
                offsetParent,
              );
              (offsets.x = offsetRect.x + offsetParent.clientLeft),
                (offsets.y = offsetRect.y + offsetParent.clientTop);
            } else
              documentElement &&
                (offsets.x = getWindowScrollBarX(documentElement));
          const htmlOffset =
            !documentElement || isOffsetParentAnElement || isFixed
              ? createCoords(0)
              : getHTMLOffset(documentElement, scroll);
          return {
            x: rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x,
            y: rect.top + scroll.scrollTop - offsets.y - htmlOffset.y,
            width: rect.width,
            height: rect.height,
          };
        }
        function isStaticPositioned(element) {
          return (
            "static" ===
            floating_ui_utils_dom_getComputedStyle(element).position
          );
        }
        function getTrueOffsetParent(element, polyfill) {
          if (
            !floating_ui_utils_dom_isHTMLElement(element) ||
            "fixed" === floating_ui_utils_dom_getComputedStyle(element).position
          )
            return null;
          if (polyfill) return polyfill(element);
          let rawOffsetParent = element.offsetParent;
          return (
            getDocumentElement(element) === rawOffsetParent &&
              (rawOffsetParent = rawOffsetParent.ownerDocument.body),
            rawOffsetParent
          );
        }
        function getOffsetParent(element, polyfill) {
          const win = floating_ui_utils_dom_getWindow(element);
          if (isTopLayer(element)) return win;
          if (!floating_ui_utils_dom_isHTMLElement(element)) {
            let svgOffsetParent = getParentNode(element);
            for (
              ;
              svgOffsetParent && !isLastTraversableNode(svgOffsetParent);

            ) {
              if (
                floating_ui_utils_dom_isElement(svgOffsetParent) &&
                !isStaticPositioned(svgOffsetParent)
              )
                return svgOffsetParent;
              svgOffsetParent = getParentNode(svgOffsetParent);
            }
            return win;
          }
          let offsetParent = getTrueOffsetParent(element, polyfill);
          for (
            ;
            offsetParent &&
            isTableElement(offsetParent) &&
            isStaticPositioned(offsetParent);

          )
            offsetParent = getTrueOffsetParent(offsetParent, polyfill);
          return offsetParent &&
            isLastTraversableNode(offsetParent) &&
            isStaticPositioned(offsetParent) &&
            !isContainingBlock(offsetParent)
            ? win
            : offsetParent ||
                (function getContainingBlock(element) {
                  let currentNode = getParentNode(element);
                  for (
                    ;
                    floating_ui_utils_dom_isHTMLElement(currentNode) &&
                    !isLastTraversableNode(currentNode);

                  ) {
                    if (isContainingBlock(currentNode)) return currentNode;
                    if (isTopLayer(currentNode)) return null;
                    currentNode = getParentNode(currentNode);
                  }
                  return null;
                })(element) ||
                win;
        }
        const platform = {
          convertOffsetParentRelativeRectToViewportRelativeRect:
            function convertOffsetParentRelativeRectToViewportRelativeRect(
              _ref,
            ) {
              let { elements, rect, offsetParent, strategy } = _ref;
              const isFixed = "fixed" === strategy,
                documentElement = getDocumentElement(offsetParent),
                topLayer = !!elements && isTopLayer(elements.floating);
              if (offsetParent === documentElement || (topLayer && isFixed))
                return rect;
              let scroll = { scrollLeft: 0, scrollTop: 0 },
                scale = createCoords(1);
              const offsets = createCoords(0),
                isOffsetParentAnElement =
                  floating_ui_utils_dom_isHTMLElement(offsetParent);
              if (
                (isOffsetParentAnElement ||
                  (!isOffsetParentAnElement && !isFixed)) &&
                (("body" !== floating_ui_utils_dom_getNodeName(offsetParent) ||
                  isOverflowElement(documentElement)) &&
                  (scroll = getNodeScroll(offsetParent)),
                floating_ui_utils_dom_isHTMLElement(offsetParent))
              ) {
                const offsetRect = getBoundingClientRect(offsetParent);
                (scale = getScale(offsetParent)),
                  (offsets.x = offsetRect.x + offsetParent.clientLeft),
                  (offsets.y = offsetRect.y + offsetParent.clientTop);
              }
              const htmlOffset =
                !documentElement || isOffsetParentAnElement || isFixed
                  ? createCoords(0)
                  : getHTMLOffset(documentElement, scroll, !0);
              return {
                width: rect.width * scale.x,
                height: rect.height * scale.y,
                x:
                  rect.x * scale.x -
                  scroll.scrollLeft * scale.x +
                  offsets.x +
                  htmlOffset.x,
                y:
                  rect.y * scale.y -
                  scroll.scrollTop * scale.y +
                  offsets.y +
                  htmlOffset.y,
              };
            },
          getDocumentElement,
          getClippingRect: function getClippingRect(_ref) {
            let { element, boundary, rootBoundary, strategy } = _ref;
            const clippingAncestors = [
                ...("clippingAncestors" === boundary
                  ? isTopLayer(element)
                    ? []
                    : (function getClippingElementAncestors(element, cache) {
                        const cachedResult = cache.get(element);
                        if (cachedResult) return cachedResult;
                        let result = getOverflowAncestors(
                            element,
                            [],
                            !1,
                          ).filter(
                            (el) =>
                              floating_ui_utils_dom_isElement(el) &&
                              "body" !== floating_ui_utils_dom_getNodeName(el),
                          ),
                          currentContainingBlockComputedStyle = null;
                        const elementIsFixed =
                          "fixed" ===
                          floating_ui_utils_dom_getComputedStyle(element)
                            .position;
                        let currentNode = elementIsFixed
                          ? getParentNode(element)
                          : element;
                        for (
                          ;
                          floating_ui_utils_dom_isElement(currentNode) &&
                          !isLastTraversableNode(currentNode);

                        ) {
                          const computedStyle =
                              floating_ui_utils_dom_getComputedStyle(
                                currentNode,
                              ),
                            currentNodeIsContaining =
                              isContainingBlock(currentNode);
                          currentNodeIsContaining ||
                            "fixed" !== computedStyle.position ||
                            (currentContainingBlockComputedStyle = null),
                            (
                              elementIsFixed
                                ? !currentNodeIsContaining &&
                                  !currentContainingBlockComputedStyle
                                : (!currentNodeIsContaining &&
                                    "static" === computedStyle.position &&
                                    currentContainingBlockComputedStyle &&
                                    ["absolute", "fixed"].includes(
                                      currentContainingBlockComputedStyle.position,
                                    )) ||
                                  (isOverflowElement(currentNode) &&
                                    !currentNodeIsContaining &&
                                    hasFixedPositionAncestor(
                                      element,
                                      currentNode,
                                    ))
                            )
                              ? (result = result.filter(
                                  (ancestor) => ancestor !== currentNode,
                                ))
                              : (currentContainingBlockComputedStyle =
                                  computedStyle),
                            (currentNode = getParentNode(currentNode));
                        }
                        return cache.set(element, result), result;
                      })(element, this._c)
                  : [].concat(boundary)),
                rootBoundary,
              ],
              firstClippingAncestor = clippingAncestors[0],
              clippingRect = clippingAncestors.reduce(
                (accRect, clippingAncestor) => {
                  const rect = getClientRectFromClippingAncestor(
                    element,
                    clippingAncestor,
                    strategy,
                  );
                  return (
                    (accRect.top = floating_ui_utils_max(
                      rect.top,
                      accRect.top,
                    )),
                    (accRect.right = floating_ui_utils_min(
                      rect.right,
                      accRect.right,
                    )),
                    (accRect.bottom = floating_ui_utils_min(
                      rect.bottom,
                      accRect.bottom,
                    )),
                    (accRect.left = floating_ui_utils_max(
                      rect.left,
                      accRect.left,
                    )),
                    accRect
                  );
                },
                getClientRectFromClippingAncestor(
                  element,
                  firstClippingAncestor,
                  strategy,
                ),
              );
            return {
              width: clippingRect.right - clippingRect.left,
              height: clippingRect.bottom - clippingRect.top,
              x: clippingRect.left,
              y: clippingRect.top,
            };
          },
          getOffsetParent,
          getElementRects: async function (data) {
            const getOffsetParentFn = this.getOffsetParent || getOffsetParent,
              getDimensionsFn = this.getDimensions,
              floatingDimensions = await getDimensionsFn(data.floating);
            return {
              reference: getRectRelativeToOffsetParent(
                data.reference,
                await getOffsetParentFn(data.floating),
                data.strategy,
              ),
              floating: {
                x: 0,
                y: 0,
                width: floatingDimensions.width,
                height: floatingDimensions.height,
              },
            };
          },
          getClientRects: function getClientRects(element) {
            return Array.from(element.getClientRects());
          },
          getDimensions: function getDimensions(element) {
            const { width, height } = getCssDimensions(element);
            return { width, height };
          },
          getScale,
          isElement: floating_ui_utils_dom_isElement,
          isRTL: function isRTL(element) {
            return (
              "rtl" ===
              floating_ui_utils_dom_getComputedStyle(element).direction
            );
          },
        };
        function rectsAreEqual(a, b) {
          return (
            a.x === b.x &&
            a.y === b.y &&
            a.width === b.width &&
            a.height === b.height
          );
        }
        function autoUpdate(reference, floating, update, options) {
          void 0 === options && (options = {});
          const {
              ancestorScroll = !0,
              ancestorResize = !0,
              elementResize = "function" == typeof ResizeObserver,
              layoutShift = "function" == typeof IntersectionObserver,
              animationFrame = !1,
            } = options,
            referenceEl = unwrapElement(reference),
            ancestors =
              ancestorScroll || ancestorResize
                ? [
                    ...(referenceEl ? getOverflowAncestors(referenceEl) : []),
                    ...getOverflowAncestors(floating),
                  ]
                : [];
          ancestors.forEach((ancestor) => {
            ancestorScroll &&
              ancestor.addEventListener("scroll", update, { passive: !0 }),
              ancestorResize && ancestor.addEventListener("resize", update);
          });
          const cleanupIo =
            referenceEl && layoutShift
              ? (function observeMove(element, onMove) {
                  let timeoutId,
                    io = null;
                  const root = getDocumentElement(element);
                  function cleanup() {
                    var _io;
                    clearTimeout(timeoutId),
                      null == (_io = io) || _io.disconnect(),
                      (io = null);
                  }
                  return (
                    (function refresh(skip, threshold) {
                      void 0 === skip && (skip = !1),
                        void 0 === threshold && (threshold = 1),
                        cleanup();
                      const elementRectForRootMargin =
                          element.getBoundingClientRect(),
                        { left, top, width, height } = elementRectForRootMargin;
                      if ((skip || onMove(), !width || !height)) return;
                      const options = {
                        rootMargin:
                          -floating_ui_utils_floor(top) +
                          "px " +
                          -floating_ui_utils_floor(
                            root.clientWidth - (left + width),
                          ) +
                          "px " +
                          -floating_ui_utils_floor(
                            root.clientHeight - (top + height),
                          ) +
                          "px " +
                          -floating_ui_utils_floor(left) +
                          "px",
                        threshold:
                          floating_ui_utils_max(
                            0,
                            floating_ui_utils_min(1, threshold),
                          ) || 1,
                      };
                      let isFirstUpdate = !0;
                      function handleObserve(entries) {
                        const ratio = entries[0].intersectionRatio;
                        if (ratio !== threshold) {
                          if (!isFirstUpdate) return refresh();
                          ratio
                            ? refresh(!1, ratio)
                            : (timeoutId = setTimeout(() => {
                                refresh(!1, 1e-7);
                              }, 1e3));
                        }
                        1 !== ratio ||
                          rectsAreEqual(
                            elementRectForRootMargin,
                            element.getBoundingClientRect(),
                          ) ||
                          refresh(),
                          (isFirstUpdate = !1);
                      }
                      try {
                        io = new IntersectionObserver(handleObserve, {
                          ...options,
                          root: root.ownerDocument,
                        });
                      } catch (e) {
                        io = new IntersectionObserver(handleObserve, options);
                      }
                      io.observe(element);
                    })(!0),
                    cleanup
                  );
                })(referenceEl, update)
              : null;
          let frameId,
            reobserveFrame = -1,
            resizeObserver = null;
          elementResize &&
            ((resizeObserver = new ResizeObserver((_ref) => {
              let [firstEntry] = _ref;
              firstEntry &&
                firstEntry.target === referenceEl &&
                resizeObserver &&
                (resizeObserver.unobserve(floating),
                cancelAnimationFrame(reobserveFrame),
                (reobserveFrame = requestAnimationFrame(() => {
                  var _resizeObserver;
                  null == (_resizeObserver = resizeObserver) ||
                    _resizeObserver.observe(floating);
                }))),
                update();
            })),
            referenceEl &&
              !animationFrame &&
              resizeObserver.observe(referenceEl),
            resizeObserver.observe(floating));
          let prevRefRect = animationFrame
            ? getBoundingClientRect(reference)
            : null;
          return (
            animationFrame &&
              (function frameLoop() {
                const nextRefRect = getBoundingClientRect(reference);
                prevRefRect &&
                  !rectsAreEqual(prevRefRect, nextRefRect) &&
                  update();
                (prevRefRect = nextRefRect),
                  (frameId = requestAnimationFrame(frameLoop));
              })(),
            update(),
            () => {
              var _resizeObserver2;
              ancestors.forEach((ancestor) => {
                ancestorScroll &&
                  ancestor.removeEventListener("scroll", update),
                  ancestorResize &&
                    ancestor.removeEventListener("resize", update);
              }),
                null == cleanupIo || cleanupIo(),
                null == (_resizeObserver2 = resizeObserver) ||
                  _resizeObserver2.disconnect(),
                (resizeObserver = null),
                animationFrame && cancelAnimationFrame(frameId);
            }
          );
        }
        const floating_ui_dom_offset = function (options) {
            return (
              void 0 === options && (options = 0),
              {
                name: "offset",
                options,
                async fn(state) {
                  var _middlewareData$offse, _middlewareData$arrow;
                  const { x, y, placement, middlewareData } = state,
                    diffCoords = await (async function convertValueToCoords(
                      state,
                      options,
                    ) {
                      const { placement, platform, elements } = state,
                        rtl = await (null == platform.isRTL
                          ? void 0
                          : platform.isRTL(elements.floating)),
                        side = floating_ui_utils_getSide(placement),
                        alignment = floating_ui_utils_getAlignment(placement),
                        isVertical =
                          "y" === floating_ui_utils_getSideAxis(placement),
                        mainAxisMulti = ["left", "top"].includes(side) ? -1 : 1,
                        crossAxisMulti = rtl && isVertical ? -1 : 1,
                        rawValue = floating_ui_utils_evaluate(options, state);
                      let { mainAxis, crossAxis, alignmentAxis } =
                        "number" == typeof rawValue
                          ? {
                              mainAxis: rawValue,
                              crossAxis: 0,
                              alignmentAxis: null,
                            }
                          : {
                              mainAxis: rawValue.mainAxis || 0,
                              crossAxis: rawValue.crossAxis || 0,
                              alignmentAxis: rawValue.alignmentAxis,
                            };
                      return (
                        alignment &&
                          "number" == typeof alignmentAxis &&
                          (crossAxis =
                            "end" === alignment
                              ? -1 * alignmentAxis
                              : alignmentAxis),
                        isVertical
                          ? {
                              x: crossAxis * crossAxisMulti,
                              y: mainAxis * mainAxisMulti,
                            }
                          : {
                              x: mainAxis * mainAxisMulti,
                              y: crossAxis * crossAxisMulti,
                            }
                      );
                    })(state, options);
                  return placement ===
                    (null == (_middlewareData$offse = middlewareData.offset)
                      ? void 0
                      : _middlewareData$offse.placement) &&
                    null != (_middlewareData$arrow = middlewareData.arrow) &&
                    _middlewareData$arrow.alignmentOffset
                    ? {}
                    : {
                        x: x + diffCoords.x,
                        y: y + diffCoords.y,
                        data: { ...diffCoords, placement },
                      };
                },
              }
            );
          },
          floating_ui_dom_shift = function (options) {
            return (
              void 0 === options && (options = {}),
              {
                name: "shift",
                options,
                async fn(state) {
                  const { x, y, placement } = state,
                    {
                      mainAxis: checkMainAxis = !0,
                      crossAxis: checkCrossAxis = !1,
                      limiter = {
                        fn: (_ref) => {
                          let { x, y } = _ref;
                          return { x, y };
                        },
                      },
                      ...detectOverflowOptions
                    } = floating_ui_utils_evaluate(options, state),
                    coords = { x, y },
                    overflow = await floating_ui_core_detectOverflow(
                      state,
                      detectOverflowOptions,
                    ),
                    crossAxis = floating_ui_utils_getSideAxis(
                      floating_ui_utils_getSide(placement),
                    ),
                    mainAxis = floating_ui_utils_getOppositeAxis(crossAxis);
                  let mainAxisCoord = coords[mainAxis],
                    crossAxisCoord = coords[crossAxis];
                  if (checkMainAxis) {
                    const maxSide = "y" === mainAxis ? "bottom" : "right";
                    mainAxisCoord = clamp(
                      mainAxisCoord +
                        overflow["y" === mainAxis ? "top" : "left"],
                      mainAxisCoord,
                      mainAxisCoord - overflow[maxSide],
                    );
                  }
                  if (checkCrossAxis) {
                    const maxSide = "y" === crossAxis ? "bottom" : "right";
                    crossAxisCoord = clamp(
                      crossAxisCoord +
                        overflow["y" === crossAxis ? "top" : "left"],
                      crossAxisCoord,
                      crossAxisCoord - overflow[maxSide],
                    );
                  }
                  const limitedCoords = limiter.fn({
                    ...state,
                    [mainAxis]: mainAxisCoord,
                    [crossAxis]: crossAxisCoord,
                  });
                  return {
                    ...limitedCoords,
                    data: {
                      x: limitedCoords.x - x,
                      y: limitedCoords.y - y,
                      enabled: {
                        [mainAxis]: checkMainAxis,
                        [crossAxis]: checkCrossAxis,
                      },
                    },
                  };
                },
              }
            );
          },
          floating_ui_dom_flip = function (options) {
            return (
              void 0 === options && (options = {}),
              {
                name: "flip",
                options,
                async fn(state) {
                  var _middlewareData$arrow, _middlewareData$flip;
                  const {
                      placement,
                      middlewareData,
                      rects,
                      initialPlacement,
                      platform,
                      elements,
                    } = state,
                    {
                      mainAxis: checkMainAxis = !0,
                      crossAxis: checkCrossAxis = !0,
                      fallbackPlacements: specifiedFallbackPlacements,
                      fallbackStrategy = "bestFit",
                      fallbackAxisSideDirection = "none",
                      flipAlignment = !0,
                      ...detectOverflowOptions
                    } = floating_ui_utils_evaluate(options, state);
                  if (
                    null != (_middlewareData$arrow = middlewareData.arrow) &&
                    _middlewareData$arrow.alignmentOffset
                  )
                    return {};
                  const side = floating_ui_utils_getSide(placement),
                    initialSideAxis =
                      floating_ui_utils_getSideAxis(initialPlacement),
                    isBasePlacement =
                      floating_ui_utils_getSide(initialPlacement) ===
                      initialPlacement,
                    rtl = await (null == platform.isRTL
                      ? void 0
                      : platform.isRTL(elements.floating)),
                    fallbackPlacements =
                      specifiedFallbackPlacements ||
                      (isBasePlacement || !flipAlignment
                        ? [getOppositePlacement(initialPlacement)]
                        : (function getExpandedPlacements(placement) {
                            const oppositePlacement =
                              getOppositePlacement(placement);
                            return [
                              floating_ui_utils_getOppositeAlignmentPlacement(
                                placement,
                              ),
                              oppositePlacement,
                              floating_ui_utils_getOppositeAlignmentPlacement(
                                oppositePlacement,
                              ),
                            ];
                          })(initialPlacement)),
                    hasFallbackAxisSideDirection =
                      "none" !== fallbackAxisSideDirection;
                  !specifiedFallbackPlacements &&
                    hasFallbackAxisSideDirection &&
                    fallbackPlacements.push(
                      ...(function getOppositeAxisPlacements(
                        placement,
                        flipAlignment,
                        direction,
                        rtl,
                      ) {
                        const alignment =
                          floating_ui_utils_getAlignment(placement);
                        let list = (function getSideList(side, isStart, rtl) {
                          const lr = ["left", "right"],
                            rl = ["right", "left"],
                            tb = ["top", "bottom"],
                            bt = ["bottom", "top"];
                          switch (side) {
                            case "top":
                            case "bottom":
                              return rtl
                                ? isStart
                                  ? rl
                                  : lr
                                : isStart
                                  ? lr
                                  : rl;
                            case "left":
                            case "right":
                              return isStart ? tb : bt;
                            default:
                              return [];
                          }
                        })(
                          floating_ui_utils_getSide(placement),
                          "start" === direction,
                          rtl,
                        );
                        return (
                          alignment &&
                            ((list = list.map(
                              (side) => side + "-" + alignment,
                            )),
                            flipAlignment &&
                              (list = list.concat(
                                list.map(
                                  floating_ui_utils_getOppositeAlignmentPlacement,
                                ),
                              ))),
                          list
                        );
                      })(
                        initialPlacement,
                        flipAlignment,
                        fallbackAxisSideDirection,
                        rtl,
                      ),
                    );
                  const placements = [initialPlacement, ...fallbackPlacements],
                    overflow = await floating_ui_core_detectOverflow(
                      state,
                      detectOverflowOptions,
                    ),
                    overflows = [];
                  let overflowsData =
                    (null == (_middlewareData$flip = middlewareData.flip)
                      ? void 0
                      : _middlewareData$flip.overflows) || [];
                  if (
                    (checkMainAxis && overflows.push(overflow[side]),
                    checkCrossAxis)
                  ) {
                    const sides = (function floating_ui_utils_getAlignmentSides(
                      placement,
                      rects,
                      rtl,
                    ) {
                      void 0 === rtl && (rtl = !1);
                      const alignment =
                          floating_ui_utils_getAlignment(placement),
                        alignmentAxis = getAlignmentAxis(placement),
                        length = getAxisLength(alignmentAxis);
                      let mainAlignmentSide =
                        "x" === alignmentAxis
                          ? alignment === (rtl ? "end" : "start")
                            ? "right"
                            : "left"
                          : "start" === alignment
                            ? "bottom"
                            : "top";
                      return (
                        rects.reference[length] > rects.floating[length] &&
                          (mainAlignmentSide =
                            getOppositePlacement(mainAlignmentSide)),
                        [
                          mainAlignmentSide,
                          getOppositePlacement(mainAlignmentSide),
                        ]
                      );
                    })(placement, rects, rtl);
                    overflows.push(overflow[sides[0]], overflow[sides[1]]);
                  }
                  if (
                    ((overflowsData = [
                      ...overflowsData,
                      { placement, overflows },
                    ]),
                    !overflows.every((side) => side <= 0))
                  ) {
                    var _middlewareData$flip2, _overflowsData$filter;
                    const nextIndex =
                        ((null == (_middlewareData$flip2 = middlewareData.flip)
                          ? void 0
                          : _middlewareData$flip2.index) || 0) + 1,
                      nextPlacement = placements[nextIndex];
                    if (nextPlacement)
                      return {
                        data: { index: nextIndex, overflows: overflowsData },
                        reset: { placement: nextPlacement },
                      };
                    let resetPlacement =
                      null ==
                      (_overflowsData$filter = overflowsData
                        .filter((d) => d.overflows[0] <= 0)
                        .sort((a, b) => a.overflows[1] - b.overflows[1])[0])
                        ? void 0
                        : _overflowsData$filter.placement;
                    if (!resetPlacement)
                      switch (fallbackStrategy) {
                        case "bestFit": {
                          var _overflowsData$filter2;
                          const placement =
                            null ==
                            (_overflowsData$filter2 = overflowsData
                              .filter((d) => {
                                if (hasFallbackAxisSideDirection) {
                                  const currentSideAxis =
                                    floating_ui_utils_getSideAxis(d.placement);
                                  return (
                                    currentSideAxis === initialSideAxis ||
                                    "y" === currentSideAxis
                                  );
                                }
                                return !0;
                              })
                              .map((d) => [
                                d.placement,
                                d.overflows
                                  .filter((overflow) => overflow > 0)
                                  .reduce((acc, overflow) => acc + overflow, 0),
                              ])
                              .sort((a, b) => a[1] - b[1])[0])
                              ? void 0
                              : _overflowsData$filter2[0];
                          placement && (resetPlacement = placement);
                          break;
                        }
                        case "initialPlacement":
                          resetPlacement = initialPlacement;
                      }
                    if (placement !== resetPlacement)
                      return { reset: { placement: resetPlacement } };
                  }
                  return {};
                },
              }
            );
          },
          floating_ui_dom_arrow = (options) => ({
            name: "arrow",
            options,
            async fn(state) {
              const {
                  x,
                  y,
                  placement,
                  rects,
                  platform,
                  elements,
                  middlewareData,
                } = state,
                { element, padding = 0 } =
                  floating_ui_utils_evaluate(options, state) || {};
              if (null == element) return {};
              const paddingObject = getPaddingObject(padding),
                coords = { x, y },
                axis = getAlignmentAxis(placement),
                length = getAxisLength(axis),
                arrowDimensions = await platform.getDimensions(element),
                isYAxis = "y" === axis,
                minProp = isYAxis ? "top" : "left",
                maxProp = isYAxis ? "bottom" : "right",
                clientProp = isYAxis ? "clientHeight" : "clientWidth",
                endDiff =
                  rects.reference[length] +
                  rects.reference[axis] -
                  coords[axis] -
                  rects.floating[length],
                startDiff = coords[axis] - rects.reference[axis],
                arrowOffsetParent = await (null == platform.getOffsetParent
                  ? void 0
                  : platform.getOffsetParent(element));
              let clientSize = arrowOffsetParent
                ? arrowOffsetParent[clientProp]
                : 0;
              (clientSize &&
                (await (null == platform.isElement
                  ? void 0
                  : platform.isElement(arrowOffsetParent)))) ||
                (clientSize =
                  elements.floating[clientProp] || rects.floating[length]);
              const centerToReference = endDiff / 2 - startDiff / 2,
                largestPossiblePadding =
                  clientSize / 2 - arrowDimensions[length] / 2 - 1,
                minPadding = floating_ui_utils_min(
                  paddingObject[minProp],
                  largestPossiblePadding,
                ),
                maxPadding = floating_ui_utils_min(
                  paddingObject[maxProp],
                  largestPossiblePadding,
                ),
                min$1 = minPadding,
                max = clientSize - arrowDimensions[length] - maxPadding,
                center =
                  clientSize / 2 -
                  arrowDimensions[length] / 2 +
                  centerToReference,
                offset = clamp(min$1, center, max),
                shouldAddOffset =
                  !middlewareData.arrow &&
                  null != floating_ui_utils_getAlignment(placement) &&
                  center !== offset &&
                  rects.reference[length] / 2 -
                    (center < min$1 ? minPadding : maxPadding) -
                    arrowDimensions[length] / 2 <
                    0,
                alignmentOffset = shouldAddOffset
                  ? center < min$1
                    ? center - min$1
                    : center - max
                  : 0;
              return {
                [axis]: coords[axis] + alignmentOffset,
                data: {
                  [axis]: offset,
                  centerOffset: center - offset - alignmentOffset,
                  ...(shouldAddOffset && { alignmentOffset }),
                },
                reset: shouldAddOffset,
              };
            },
          }),
          floating_ui_dom_inline = function (options) {
            return (
              void 0 === options && (options = {}),
              {
                name: "inline",
                options,
                async fn(state) {
                  const { placement, elements, rects, platform, strategy } =
                      state,
                    {
                      padding = 2,
                      x,
                      y,
                    } = floating_ui_utils_evaluate(options, state),
                    nativeClientRects = Array.from(
                      (await (null == platform.getClientRects
                        ? void 0
                        : platform.getClientRects(elements.reference))) || [],
                    ),
                    clientRects = (function getRectsByLine(rects) {
                      const sortedRects = rects
                          .slice()
                          .sort((a, b) => a.y - b.y),
                        groups = [];
                      let prevRect = null;
                      for (let i = 0; i < sortedRects.length; i++) {
                        const rect = sortedRects[i];
                        !prevRect || rect.y - prevRect.y > prevRect.height / 2
                          ? groups.push([rect])
                          : groups[groups.length - 1].push(rect),
                          (prevRect = rect);
                      }
                      return groups.map((rect) =>
                        rectToClientRect(getBoundingRect(rect)),
                      );
                    })(nativeClientRects),
                    fallback = rectToClientRect(
                      getBoundingRect(nativeClientRects),
                    ),
                    paddingObject = getPaddingObject(padding);
                  const resetRects = await platform.getElementRects({
                    reference: {
                      getBoundingClientRect: function getBoundingClientRect() {
                        if (
                          2 === clientRects.length &&
                          clientRects[0].left > clientRects[1].right &&
                          null != x &&
                          null != y
                        )
                          return (
                            clientRects.find(
                              (rect) =>
                                x > rect.left - paddingObject.left &&
                                x < rect.right + paddingObject.right &&
                                y > rect.top - paddingObject.top &&
                                y < rect.bottom + paddingObject.bottom,
                            ) || fallback
                          );
                        if (clientRects.length >= 2) {
                          if (
                            "y" === floating_ui_utils_getSideAxis(placement)
                          ) {
                            const firstRect = clientRects[0],
                              lastRect = clientRects[clientRects.length - 1],
                              isTop =
                                "top" === floating_ui_utils_getSide(placement),
                              top = firstRect.top,
                              bottom = lastRect.bottom,
                              left = isTop ? firstRect.left : lastRect.left,
                              right = isTop ? firstRect.right : lastRect.right;
                            return {
                              top,
                              bottom,
                              left,
                              right,
                              width: right - left,
                              height: bottom - top,
                              x: left,
                              y: top,
                            };
                          }
                          const isLeftSide =
                              "left" === floating_ui_utils_getSide(placement),
                            maxRight = floating_ui_utils_max(
                              ...clientRects.map((rect) => rect.right),
                            ),
                            minLeft = floating_ui_utils_min(
                              ...clientRects.map((rect) => rect.left),
                            ),
                            measureRects = clientRects.filter((rect) =>
                              isLeftSide
                                ? rect.left === minLeft
                                : rect.right === maxRight,
                            ),
                            top = measureRects[0].top,
                            bottom =
                              measureRects[measureRects.length - 1].bottom;
                          return {
                            top,
                            bottom,
                            left: minLeft,
                            right: maxRight,
                            width: maxRight - minLeft,
                            height: bottom - top,
                            x: minLeft,
                            y: top,
                          };
                        }
                        return fallback;
                      },
                    },
                    floating: elements.floating,
                    strategy,
                  });
                  return rects.reference.x !== resetRects.reference.x ||
                    rects.reference.y !== resetRects.reference.y ||
                    rects.reference.width !== resetRects.reference.width ||
                    rects.reference.height !== resetRects.reference.height
                    ? { reset: { rects: resetRects } }
                    : {};
                },
              }
            );
          },
          floating_ui_dom_computePosition = (reference, floating, options) => {
            const cache = new Map(),
              mergedOptions = { platform, ...options },
              platformWithCache = { ...mergedOptions.platform, _c: cache };
            return (async (reference, floating, config) => {
              const {
                  placement = "bottom",
                  strategy = "absolute",
                  middleware = [],
                  platform,
                } = config,
                validMiddleware = middleware.filter(Boolean),
                rtl = await (null == platform.isRTL
                  ? void 0
                  : platform.isRTL(floating));
              let rects = await platform.getElementRects({
                  reference,
                  floating,
                  strategy,
                }),
                { x, y } = computeCoordsFromPlacement(rects, placement, rtl),
                statefulPlacement = placement,
                middlewareData = {},
                resetCount = 0;
              for (let i = 0; i < validMiddleware.length; i++) {
                const { name, fn } = validMiddleware[i],
                  {
                    x: nextX,
                    y: nextY,
                    data,
                    reset,
                  } = await fn({
                    x,
                    y,
                    initialPlacement: placement,
                    placement: statefulPlacement,
                    strategy,
                    middlewareData,
                    rects,
                    platform,
                    elements: { reference, floating },
                  });
                (x = null != nextX ? nextX : x),
                  (y = null != nextY ? nextY : y),
                  (middlewareData = {
                    ...middlewareData,
                    [name]: { ...middlewareData[name], ...data },
                  }),
                  reset &&
                    resetCount <= 50 &&
                    (resetCount++,
                    "object" == typeof reset &&
                      (reset.placement && (statefulPlacement = reset.placement),
                      reset.rects &&
                        (rects =
                          !0 === reset.rects
                            ? await platform.getElementRects({
                                reference,
                                floating,
                                strategy,
                              })
                            : reset.rects),
                      ({ x, y } = computeCoordsFromPlacement(
                        rects,
                        statefulPlacement,
                        rtl,
                      ))),
                    (i = -1));
              }
              return {
                x,
                y,
                placement: statefulPlacement,
                strategy,
                middlewareData,
              };
            })(reference, floating, {
              ...mergedOptions,
              platform: platformWithCache,
            });
          };
        var index =
          "undefined" != typeof document
            ? react.useLayoutEffect
            : react.useEffect;
        function deepEqual(a, b) {
          if (a === b) return !0;
          if (typeof a != typeof b) return !1;
          if ("function" == typeof a && a.toString() === b.toString())
            return !0;
          let length, i, keys;
          if (a && b && "object" == typeof a) {
            if (Array.isArray(a)) {
              if (((length = a.length), length !== b.length)) return !1;
              for (i = length; 0 != i--; )
                if (!deepEqual(a[i], b[i])) return !1;
              return !0;
            }
            if (
              ((keys = Object.keys(a)),
              (length = keys.length),
              length !== Object.keys(b).length)
            )
              return !1;
            for (i = length; 0 != i--; )
              if (!{}.hasOwnProperty.call(b, keys[i])) return !1;
            for (i = length; 0 != i--; ) {
              const key = keys[i];
              if (
                ("_owner" !== key || !a.$$typeof) &&
                !deepEqual(a[key], b[key])
              )
                return !1;
            }
            return !0;
          }
          return a != a && b != b;
        }
        function getDPR(element) {
          if ("undefined" == typeof window) return 1;
          return (
            (element.ownerDocument.defaultView || window).devicePixelRatio || 1
          );
        }
        function roundByDPR(element, value) {
          const dpr = getDPR(element);
          return Math.round(value * dpr) / dpr;
        }
        function useLatestRef(value) {
          const ref = react.useRef(value);
          return (
            index(() => {
              ref.current = value;
            }),
            ref
          );
        }
        const arrow$1 = (options) => ({
            name: "arrow",
            options,
            fn(state) {
              const { element, padding } =
                "function" == typeof options ? options(state) : options;
              return element &&
                (function isRef(value) {
                  return {}.hasOwnProperty.call(value, "current");
                })(element)
                ? null != element.current
                  ? floating_ui_dom_arrow({
                      element: element.current,
                      padding,
                    }).fn(state)
                  : {}
                : element
                  ? floating_ui_dom_arrow({ element, padding }).fn(state)
                  : {};
            },
          }),
          floating_ui_react_dom_shift = (options, deps) => ({
            ...floating_ui_dom_shift(options),
            options: [options, deps],
          }),
          floating_ui_react_dom_flip = (options, deps) => ({
            ...floating_ui_dom_flip(options),
            options: [options, deps],
          }),
          floating_ui_react_dom_inline = (options, deps) => ({
            ...floating_ui_dom_inline(options),
            options: [options, deps],
          });
        __webpack_require__(
          "./node_modules/.pnpm/console-browserify@1.2.0/node_modules/console-browserify/index.js",
        );
        const SafeReact = { ...react_namespaceObject },
          useSafeInsertionEffect =
            SafeReact.useInsertionEffect || ((fn) => fn());
        function useEffectEvent(callback) {
          const ref = react.useRef(() => {
            0;
          });
          return (
            useSafeInsertionEffect(() => {
              ref.current = callback;
            }),
            react.useCallback(function () {
              for (
                var _len = arguments.length, args = new Array(_len), _key = 0;
                _key < _len;
                _key++
              )
                args[_key] = arguments[_key];
              return null == ref.current ? void 0 : ref.current(...args);
            }, [])
          );
        }
        var floating_ui_react_index =
          "undefined" != typeof document
            ? react.useLayoutEffect
            : react.useEffect;
        const horizontalKeys = ["ArrowLeft", "ArrowRight"],
          verticalKeys = ["ArrowUp", "ArrowDown"];
        let serverHandoffComplete = !1,
          count = 0;
        const genId = () =>
          "floating-ui-" + Math.random().toString(36).slice(2, 6) + count++;
        const useId =
          SafeReact.useId ||
          function useFloatingId() {
            const [id, setId] = react.useState(() =>
              serverHandoffComplete ? genId() : void 0,
            );
            return (
              floating_ui_react_index(() => {
                null == id && setId(genId());
              }, []),
              react.useEffect(() => {
                serverHandoffComplete = !0;
              }, []),
              id
            );
          };
        function createPubSub() {
          const map = new Map();
          return {
            emit(event, data) {
              var _map$get;
              null == (_map$get = map.get(event)) ||
                _map$get.forEach((handler) => handler(data));
            },
            on(event, listener) {
              map.set(event, [...(map.get(event) || []), listener]);
            },
            off(event, listener) {
              var _map$get2;
              map.set(
                event,
                (null == (_map$get2 = map.get(event))
                  ? void 0
                  : _map$get2.filter((l) => l !== listener)) || [],
              );
            },
          };
        }
        const FloatingNodeContext = react.createContext(null),
          FloatingTreeContext = react.createContext(null),
          useFloatingParentNodeId = () => {
            var _React$useContext;
            return (
              (null ==
              (_React$useContext = react.useContext(FloatingNodeContext))
                ? void 0
                : _React$useContext.id) || null
            );
          },
          useFloatingTree = () => react.useContext(FloatingTreeContext);
        function createAttribute(name) {
          return "data-floating-ui-" + name;
        }
        function floating_ui_react_useLatestRef(value) {
          const ref = (0, react.useRef)(value);
          return (
            floating_ui_react_index(() => {
              ref.current = value;
            }),
            ref
          );
        }
        const safePolygonIdentifier = createAttribute("safe-polygon");
        function getDelay(value, prop, pointerType) {
          return pointerType &&
            !floating_ui_react_utils_isMouseLikePointerType(pointerType)
            ? 0
            : "number" == typeof value
              ? value
              : null == value
                ? void 0
                : value[prop];
        }
        function useHover(context, props) {
          void 0 === props && (props = {});
          const { open, onOpenChange, dataRef, events, elements } = context,
            {
              enabled = !0,
              delay = 0,
              handleClose = null,
              mouseOnly = !1,
              restMs = 0,
              move = !0,
            } = props,
            tree = useFloatingTree(),
            parentId = useFloatingParentNodeId(),
            handleCloseRef = floating_ui_react_useLatestRef(handleClose),
            delayRef = floating_ui_react_useLatestRef(delay),
            openRef = floating_ui_react_useLatestRef(open),
            pointerTypeRef = react.useRef(),
            timeoutRef = react.useRef(-1),
            handlerRef = react.useRef(),
            restTimeoutRef = react.useRef(-1),
            blockMouseMoveRef = react.useRef(!0),
            performedPointerEventsMutationRef = react.useRef(!1),
            unbindMouseMoveRef = react.useRef(() => {}),
            restTimeoutPendingRef = react.useRef(!1),
            isHoverOpen = react.useCallback(() => {
              var _dataRef$current$open;
              const type =
                null == (_dataRef$current$open = dataRef.current.openEvent)
                  ? void 0
                  : _dataRef$current$open.type;
              return (
                (null == type ? void 0 : type.includes("mouse")) &&
                "mousedown" !== type
              );
            }, [dataRef]);
          react.useEffect(() => {
            if (enabled)
              return (
                events.on("openchange", onOpenChange),
                () => {
                  events.off("openchange", onOpenChange);
                }
              );
            function onOpenChange(_ref) {
              let { open } = _ref;
              open ||
                (clearTimeout(timeoutRef.current),
                clearTimeout(restTimeoutRef.current),
                (blockMouseMoveRef.current = !0),
                (restTimeoutPendingRef.current = !1));
            }
          }, [enabled, events]),
            react.useEffect(() => {
              if (!enabled) return;
              if (!handleCloseRef.current) return;
              if (!open) return;
              function onLeave(event) {
                isHoverOpen() && onOpenChange(!1, event, "hover");
              }
              const html = floating_ui_react_utils_getDocument(
                elements.floating,
              ).documentElement;
              return (
                html.addEventListener("mouseleave", onLeave),
                () => {
                  html.removeEventListener("mouseleave", onLeave);
                }
              );
            }, [
              elements.floating,
              open,
              onOpenChange,
              enabled,
              handleCloseRef,
              isHoverOpen,
            ]);
          const closeWithDelay = react.useCallback(
              function (event, runElseBranch, reason) {
                void 0 === runElseBranch && (runElseBranch = !0),
                  void 0 === reason && (reason = "hover");
                const closeDelay = getDelay(
                  delayRef.current,
                  "close",
                  pointerTypeRef.current,
                );
                closeDelay && !handlerRef.current
                  ? (clearTimeout(timeoutRef.current),
                    (timeoutRef.current = window.setTimeout(
                      () => onOpenChange(!1, event, reason),
                      closeDelay,
                    )))
                  : runElseBranch &&
                    (clearTimeout(timeoutRef.current),
                    onOpenChange(!1, event, reason));
              },
              [delayRef, onOpenChange],
            ),
            cleanupMouseMoveHandler = useEffectEvent(() => {
              unbindMouseMoveRef.current(), (handlerRef.current = void 0);
            }),
            clearPointerEvents = useEffectEvent(() => {
              if (performedPointerEventsMutationRef.current) {
                const body = floating_ui_react_utils_getDocument(
                  elements.floating,
                ).body;
                (body.style.pointerEvents = ""),
                  body.removeAttribute(safePolygonIdentifier),
                  (performedPointerEventsMutationRef.current = !1);
              }
            }),
            isClickLikeOpenEvent = useEffectEvent(
              () =>
                !!dataRef.current.openEvent &&
                ["click", "mousedown"].includes(dataRef.current.openEvent.type),
            );
          react.useEffect(() => {
            if (
              enabled &&
              floating_ui_utils_dom_isElement(elements.domReference)
            ) {
              var _elements$floating;
              const ref = elements.domReference;
              return (
                open && ref.addEventListener("mouseleave", onScrollMouseLeave),
                null == (_elements$floating = elements.floating) ||
                  _elements$floating.addEventListener(
                    "mouseleave",
                    onScrollMouseLeave,
                  ),
                move &&
                  ref.addEventListener("mousemove", onMouseEnter, { once: !0 }),
                ref.addEventListener("mouseenter", onMouseEnter),
                ref.addEventListener("mouseleave", onMouseLeave),
                () => {
                  var _elements$floating2;
                  open &&
                    ref.removeEventListener("mouseleave", onScrollMouseLeave),
                    null == (_elements$floating2 = elements.floating) ||
                      _elements$floating2.removeEventListener(
                        "mouseleave",
                        onScrollMouseLeave,
                      ),
                    move && ref.removeEventListener("mousemove", onMouseEnter),
                    ref.removeEventListener("mouseenter", onMouseEnter),
                    ref.removeEventListener("mouseleave", onMouseLeave);
                }
              );
            }
            function onMouseEnter(event) {
              if (
                (clearTimeout(timeoutRef.current),
                (blockMouseMoveRef.current = !1),
                (mouseOnly &&
                  !floating_ui_react_utils_isMouseLikePointerType(
                    pointerTypeRef.current,
                  )) ||
                  (restMs > 0 && !getDelay(delayRef.current, "open")))
              )
                return;
              const openDelay = getDelay(
                delayRef.current,
                "open",
                pointerTypeRef.current,
              );
              openDelay
                ? (timeoutRef.current = window.setTimeout(() => {
                    openRef.current || onOpenChange(!0, event, "hover");
                  }, openDelay))
                : open || onOpenChange(!0, event, "hover");
            }
            function onMouseLeave(event) {
              if (isClickLikeOpenEvent()) return;
              unbindMouseMoveRef.current();
              const doc = floating_ui_react_utils_getDocument(
                elements.floating,
              );
              if (
                (clearTimeout(restTimeoutRef.current),
                (restTimeoutPendingRef.current = !1),
                handleCloseRef.current && dataRef.current.floatingContext)
              ) {
                open || clearTimeout(timeoutRef.current),
                  (handlerRef.current = handleCloseRef.current({
                    ...dataRef.current.floatingContext,
                    tree,
                    x: event.clientX,
                    y: event.clientY,
                    onClose() {
                      clearPointerEvents(),
                        cleanupMouseMoveHandler(),
                        isClickLikeOpenEvent() ||
                          closeWithDelay(event, !0, "safe-polygon");
                    },
                  }));
                const handler = handlerRef.current;
                return (
                  doc.addEventListener("mousemove", handler),
                  void (unbindMouseMoveRef.current = () => {
                    doc.removeEventListener("mousemove", handler);
                  })
                );
              }
              ("touch" !== pointerTypeRef.current ||
                !floating_ui_react_utils_contains(
                  elements.floating,
                  event.relatedTarget,
                )) &&
                closeWithDelay(event);
            }
            function onScrollMouseLeave(event) {
              isClickLikeOpenEvent() ||
                (dataRef.current.floatingContext &&
                  (null == handleCloseRef.current ||
                    handleCloseRef.current({
                      ...dataRef.current.floatingContext,
                      tree,
                      x: event.clientX,
                      y: event.clientY,
                      onClose() {
                        clearPointerEvents(),
                          cleanupMouseMoveHandler(),
                          isClickLikeOpenEvent() || closeWithDelay(event);
                      },
                    })(event)));
            }
          }, [
            elements,
            enabled,
            context,
            mouseOnly,
            restMs,
            move,
            closeWithDelay,
            cleanupMouseMoveHandler,
            clearPointerEvents,
            onOpenChange,
            open,
            openRef,
            tree,
            delayRef,
            handleCloseRef,
            dataRef,
            isClickLikeOpenEvent,
          ]),
            floating_ui_react_index(() => {
              var _handleCloseRef$curre;
              if (
                enabled &&
                open &&
                null != (_handleCloseRef$curre = handleCloseRef.current) &&
                _handleCloseRef$curre.__options.blockPointerEvents &&
                isHoverOpen()
              ) {
                performedPointerEventsMutationRef.current = !0;
                const floatingEl = elements.floating;
                if (
                  floating_ui_utils_dom_isElement(elements.domReference) &&
                  floatingEl
                ) {
                  var _tree$nodesRef$curren;
                  const body = floating_ui_react_utils_getDocument(
                    elements.floating,
                  ).body;
                  body.setAttribute(safePolygonIdentifier, "");
                  const ref = elements.domReference,
                    parentFloating =
                      null == tree ||
                      null ==
                        (_tree$nodesRef$curren = tree.nodesRef.current.find(
                          (node) => node.id === parentId,
                        )) ||
                      null ==
                        (_tree$nodesRef$curren = _tree$nodesRef$curren.context)
                        ? void 0
                        : _tree$nodesRef$curren.elements.floating;
                  return (
                    parentFloating && (parentFloating.style.pointerEvents = ""),
                    (body.style.pointerEvents = "none"),
                    (ref.style.pointerEvents = "auto"),
                    (floatingEl.style.pointerEvents = "auto"),
                    () => {
                      (body.style.pointerEvents = ""),
                        (ref.style.pointerEvents = ""),
                        (floatingEl.style.pointerEvents = "");
                    }
                  );
                }
              }
            }, [
              enabled,
              open,
              parentId,
              elements,
              tree,
              handleCloseRef,
              isHoverOpen,
            ]),
            floating_ui_react_index(() => {
              open ||
                ((pointerTypeRef.current = void 0),
                (restTimeoutPendingRef.current = !1),
                cleanupMouseMoveHandler(),
                clearPointerEvents());
            }, [open, cleanupMouseMoveHandler, clearPointerEvents]),
            react.useEffect(
              () => () => {
                cleanupMouseMoveHandler(),
                  clearTimeout(timeoutRef.current),
                  clearTimeout(restTimeoutRef.current),
                  clearPointerEvents();
              },
              [
                enabled,
                elements.domReference,
                cleanupMouseMoveHandler,
                clearPointerEvents,
              ],
            );
          const reference = react.useMemo(() => {
              function setPointerRef(event) {
                pointerTypeRef.current = event.pointerType;
              }
              return {
                onPointerDown: setPointerRef,
                onPointerEnter: setPointerRef,
                onMouseMove(event) {
                  const { nativeEvent } = event;
                  function handleMouseMove() {
                    blockMouseMoveRef.current ||
                      openRef.current ||
                      onOpenChange(!0, nativeEvent, "hover");
                  }
                  (mouseOnly &&
                    !floating_ui_react_utils_isMouseLikePointerType(
                      pointerTypeRef.current,
                    )) ||
                    open ||
                    0 === restMs ||
                    (restTimeoutPendingRef.current &&
                      event.movementX ** 2 + event.movementY ** 2 < 2) ||
                    (clearTimeout(restTimeoutRef.current),
                    "touch" === pointerTypeRef.current
                      ? handleMouseMove()
                      : ((restTimeoutPendingRef.current = !0),
                        (restTimeoutRef.current = window.setTimeout(
                          handleMouseMove,
                          restMs,
                        ))));
                },
              };
            }, [mouseOnly, onOpenChange, open, openRef, restMs]),
            floating = react.useMemo(
              () => ({
                onMouseEnter() {
                  clearTimeout(timeoutRef.current);
                },
                onMouseLeave(event) {
                  isClickLikeOpenEvent() ||
                    closeWithDelay(event.nativeEvent, !1);
                },
              }),
              [closeWithDelay, isClickLikeOpenEvent],
            );
          return react.useMemo(
            () => (enabled ? { reference, floating } : {}),
            [enabled, reference, floating],
          );
        }
        const NOOP = () => {},
          FloatingDelayGroupContext = react.createContext({
            delay: 0,
            initialDelay: 0,
            timeoutMs: 0,
            currentId: null,
            setCurrentId: NOOP,
            setState: NOOP,
            isInstantPhase: !1,
          });
        function FloatingDelayGroup(props) {
          const { children, delay, timeoutMs = 0 } = props,
            [state, setState] = react.useReducer(
              (prev, next) => ({ ...prev, ...next }),
              {
                delay,
                timeoutMs,
                initialDelay: delay,
                currentId: null,
                isInstantPhase: !1,
              },
            ),
            initialCurrentIdRef = react.useRef(null),
            setCurrentId = react.useCallback((currentId) => {
              setState({ currentId });
            }, []);
          return (
            floating_ui_react_index(() => {
              state.currentId
                ? null === initialCurrentIdRef.current
                  ? (initialCurrentIdRef.current = state.currentId)
                  : state.isInstantPhase || setState({ isInstantPhase: !0 })
                : (state.isInstantPhase && setState({ isInstantPhase: !1 }),
                  (initialCurrentIdRef.current = null));
            }, [state.currentId, state.isInstantPhase]),
            react.createElement(
              FloatingDelayGroupContext.Provider,
              {
                value: react.useMemo(
                  () => ({ ...state, setState, setCurrentId }),
                  [state, setCurrentId],
                ),
              },
              children,
            )
          );
        }
        function useDelayGroup(context, options) {
          void 0 === options && (options = {});
          const { open, onOpenChange, floatingId } = context,
            { id: optionId, enabled = !0 } = options,
            id = null != optionId ? optionId : floatingId,
            groupContext = react.useContext(FloatingDelayGroupContext),
            { currentId, setCurrentId, initialDelay, setState, timeoutMs } =
              groupContext;
          return (
            floating_ui_react_index(() => {
              enabled &&
                currentId &&
                (setState({
                  delay: { open: 1, close: getDelay(initialDelay, "close") },
                }),
                currentId !== id && onOpenChange(!1));
            }, [enabled, id, onOpenChange, setState, currentId, initialDelay]),
            floating_ui_react_index(() => {
              function unset() {
                onOpenChange(!1),
                  setState({ delay: initialDelay, currentId: null });
              }
              if (enabled && currentId && !open && currentId === id) {
                if (timeoutMs) {
                  const timeout = window.setTimeout(unset, timeoutMs);
                  return () => {
                    clearTimeout(timeout);
                  };
                }
                unset();
              }
            }, [
              enabled,
              open,
              setState,
              currentId,
              id,
              onOpenChange,
              initialDelay,
              timeoutMs,
            ]),
            floating_ui_react_index(() => {
              enabled && setCurrentId !== NOOP && open && setCurrentId(id);
            }, [enabled, open, setCurrentId, id]),
            groupContext
          );
        }
        function getChildren(nodes, id) {
          let allChildren = nodes.filter((node) => {
              var _node$context;
              return (
                node.parentId === id &&
                (null == (_node$context = node.context)
                  ? void 0
                  : _node$context.open)
              );
            }),
            currentChildren = allChildren;
          for (; currentChildren.length; )
            (currentChildren = nodes.filter((node) => {
              var _currentChildren;
              return null == (_currentChildren = currentChildren)
                ? void 0
                : _currentChildren.some((n) => {
                    var _node$context2;
                    return (
                      node.parentId === n.id &&
                      (null == (_node$context2 = node.context)
                        ? void 0
                        : _node$context2.open)
                    );
                  });
            })),
              (allChildren = allChildren.concat(currentChildren));
          return allChildren;
        }
        const FOCUSABLE_ATTRIBUTE = "data-floating-ui-focusable";
        const bubbleHandlerKeys = {
            pointerdown: "onPointerDown",
            mousedown: "onMouseDown",
            click: "onClick",
          },
          captureHandlerKeys = {
            pointerdown: "onPointerDownCapture",
            mousedown: "onMouseDownCapture",
            click: "onClickCapture",
          },
          normalizeProp = (normalizable) => {
            var _normalizable$escapeK, _normalizable$outside;
            return {
              escapeKey:
                "boolean" == typeof normalizable
                  ? normalizable
                  : null !=
                      (_normalizable$escapeK =
                        null == normalizable
                          ? void 0
                          : normalizable.escapeKey) && _normalizable$escapeK,
              outsidePress:
                "boolean" == typeof normalizable
                  ? normalizable
                  : null ==
                      (_normalizable$outside =
                        null == normalizable
                          ? void 0
                          : normalizable.outsidePress) || _normalizable$outside,
            };
          };
        function useDismiss(context, props) {
          void 0 === props && (props = {});
          const { open, onOpenChange, elements, dataRef } = context,
            {
              enabled = !0,
              escapeKey = !0,
              outsidePress: unstable_outsidePress = !0,
              outsidePressEvent = "pointerdown",
              referencePress = !1,
              referencePressEvent = "pointerdown",
              ancestorScroll = !1,
              bubbles,
              capture,
            } = props,
            tree = useFloatingTree(),
            outsidePressFn = useEffectEvent(
              "function" == typeof unstable_outsidePress
                ? unstable_outsidePress
                : () => !1,
            ),
            outsidePress =
              "function" == typeof unstable_outsidePress
                ? outsidePressFn
                : unstable_outsidePress,
            insideReactTreeRef = react.useRef(!1),
            endedOrStartedInsideRef = react.useRef(!1),
            { escapeKey: escapeKeyBubbles, outsidePress: outsidePressBubbles } =
              normalizeProp(bubbles),
            { escapeKey: escapeKeyCapture, outsidePress: outsidePressCapture } =
              normalizeProp(capture),
            isComposingRef = react.useRef(!1),
            closeOnEscapeKeyDown = useEffectEvent((event) => {
              var _dataRef$current$floa;
              if (!open || !enabled || !escapeKey || "Escape" !== event.key)
                return;
              if (isComposingRef.current) return;
              const nodeId =
                  null ==
                  (_dataRef$current$floa = dataRef.current.floatingContext)
                    ? void 0
                    : _dataRef$current$floa.nodeId,
                children = tree
                  ? getChildren(tree.nodesRef.current, nodeId)
                  : [];
              if (
                !escapeKeyBubbles &&
                (event.stopPropagation(), children.length > 0)
              ) {
                let shouldDismiss = !0;
                if (
                  (children.forEach((child) => {
                    var _child$context;
                    null == (_child$context = child.context) ||
                      !_child$context.open ||
                      child.context.dataRef.current.__escapeKeyBubbles ||
                      (shouldDismiss = !1);
                  }),
                  !shouldDismiss)
                )
                  return;
              }
              onOpenChange(
                !1,
                (function isReactEvent(event) {
                  return "nativeEvent" in event;
                })(event)
                  ? event.nativeEvent
                  : event,
                "escape-key",
              );
            }),
            closeOnEscapeKeyDownCapture = useEffectEvent((event) => {
              var _getTarget2;
              const callback = () => {
                var _getTarget;
                closeOnEscapeKeyDown(event),
                  null ==
                    (_getTarget = floating_ui_react_utils_getTarget(event)) ||
                    _getTarget.removeEventListener("keydown", callback);
              };
              null ==
                (_getTarget2 = floating_ui_react_utils_getTarget(event)) ||
                _getTarget2.addEventListener("keydown", callback);
            }),
            closeOnPressOutside = useEffectEvent((event) => {
              var _dataRef$current$floa2;
              const insideReactTree = insideReactTreeRef.current;
              insideReactTreeRef.current = !1;
              const endedOrStartedInside = endedOrStartedInsideRef.current;
              if (
                ((endedOrStartedInsideRef.current = !1),
                "click" === outsidePressEvent && endedOrStartedInside)
              )
                return;
              if (insideReactTree) return;
              if ("function" == typeof outsidePress && !outsidePress(event))
                return;
              const target = floating_ui_react_utils_getTarget(event),
                inertSelector = "[" + createAttribute("inert") + "]",
                markers = floating_ui_react_utils_getDocument(
                  elements.floating,
                ).querySelectorAll(inertSelector);
              let targetRootAncestor = floating_ui_utils_dom_isElement(target)
                ? target
                : null;
              for (
                ;
                targetRootAncestor &&
                !isLastTraversableNode(targetRootAncestor);

              ) {
                const nextParent = getParentNode(targetRootAncestor);
                if (
                  isLastTraversableNode(nextParent) ||
                  !floating_ui_utils_dom_isElement(nextParent)
                )
                  break;
                targetRootAncestor = nextParent;
              }
              if (
                markers.length &&
                floating_ui_utils_dom_isElement(target) &&
                !(function isRootElement(element) {
                  return element.matches("html,body");
                })(target) &&
                !floating_ui_react_utils_contains(target, elements.floating) &&
                Array.from(markers).every(
                  (marker) =>
                    !floating_ui_react_utils_contains(
                      targetRootAncestor,
                      marker,
                    ),
                )
              )
                return;
              if (floating_ui_utils_dom_isHTMLElement(target) && floating) {
                const canScrollX =
                    target.clientWidth > 0 &&
                    target.scrollWidth > target.clientWidth,
                  canScrollY =
                    target.clientHeight > 0 &&
                    target.scrollHeight > target.clientHeight;
                let xCond = canScrollY && event.offsetX > target.clientWidth;
                if (canScrollY) {
                  "rtl" ===
                    floating_ui_utils_dom_getComputedStyle(target).direction &&
                    (xCond =
                      event.offsetX <= target.offsetWidth - target.clientWidth);
                }
                if (
                  xCond ||
                  (canScrollX && event.offsetY > target.clientHeight)
                )
                  return;
              }
              const nodeId =
                  null ==
                  (_dataRef$current$floa2 = dataRef.current.floatingContext)
                    ? void 0
                    : _dataRef$current$floa2.nodeId,
                targetIsInsideChildren =
                  tree &&
                  getChildren(tree.nodesRef.current, nodeId).some((node) => {
                    var _node$context;
                    return isEventTargetWithin(
                      event,
                      null == (_node$context = node.context)
                        ? void 0
                        : _node$context.elements.floating,
                    );
                  });
              if (
                isEventTargetWithin(event, elements.floating) ||
                isEventTargetWithin(event, elements.domReference) ||
                targetIsInsideChildren
              )
                return;
              const children = tree
                ? getChildren(tree.nodesRef.current, nodeId)
                : [];
              if (children.length > 0) {
                let shouldDismiss = !0;
                if (
                  (children.forEach((child) => {
                    var _child$context2;
                    null == (_child$context2 = child.context) ||
                      !_child$context2.open ||
                      child.context.dataRef.current.__outsidePressBubbles ||
                      (shouldDismiss = !1);
                  }),
                  !shouldDismiss)
                )
                  return;
              }
              onOpenChange(!1, event, "outside-press");
            }),
            closeOnPressOutsideCapture = useEffectEvent((event) => {
              var _getTarget4;
              const callback = () => {
                var _getTarget3;
                closeOnPressOutside(event),
                  null ==
                    (_getTarget3 = floating_ui_react_utils_getTarget(event)) ||
                    _getTarget3.removeEventListener(
                      outsidePressEvent,
                      callback,
                    );
              };
              null ==
                (_getTarget4 = floating_ui_react_utils_getTarget(event)) ||
                _getTarget4.addEventListener(outsidePressEvent, callback);
            });
          react.useEffect(() => {
            if (!open || !enabled) return;
            (dataRef.current.__escapeKeyBubbles = escapeKeyBubbles),
              (dataRef.current.__outsidePressBubbles = outsidePressBubbles);
            let compositionTimeout = -1;
            function onScroll(event) {
              onOpenChange(!1, event, "ancestor-scroll");
            }
            function handleCompositionStart() {
              window.clearTimeout(compositionTimeout),
                (isComposingRef.current = !0);
            }
            function handleCompositionEnd() {
              compositionTimeout = window.setTimeout(
                () => {
                  isComposingRef.current = !1;
                },
                isWebKit() ? 5 : 0,
              );
            }
            const doc = floating_ui_react_utils_getDocument(elements.floating);
            escapeKey &&
              (doc.addEventListener(
                "keydown",
                escapeKeyCapture
                  ? closeOnEscapeKeyDownCapture
                  : closeOnEscapeKeyDown,
                escapeKeyCapture,
              ),
              doc.addEventListener("compositionstart", handleCompositionStart),
              doc.addEventListener("compositionend", handleCompositionEnd)),
              outsidePress &&
                doc.addEventListener(
                  outsidePressEvent,
                  outsidePressCapture
                    ? closeOnPressOutsideCapture
                    : closeOnPressOutside,
                  outsidePressCapture,
                );
            let ancestors = [];
            return (
              ancestorScroll &&
                (floating_ui_utils_dom_isElement(elements.domReference) &&
                  (ancestors = getOverflowAncestors(elements.domReference)),
                floating_ui_utils_dom_isElement(elements.floating) &&
                  (ancestors = ancestors.concat(
                    getOverflowAncestors(elements.floating),
                  )),
                !floating_ui_utils_dom_isElement(elements.reference) &&
                  elements.reference &&
                  elements.reference.contextElement &&
                  (ancestors = ancestors.concat(
                    getOverflowAncestors(elements.reference.contextElement),
                  ))),
              (ancestors = ancestors.filter((ancestor) => {
                var _doc$defaultView;
                return (
                  ancestor !==
                  (null == (_doc$defaultView = doc.defaultView)
                    ? void 0
                    : _doc$defaultView.visualViewport)
                );
              })),
              ancestors.forEach((ancestor) => {
                ancestor.addEventListener("scroll", onScroll, { passive: !0 });
              }),
              () => {
                escapeKey &&
                  (doc.removeEventListener(
                    "keydown",
                    escapeKeyCapture
                      ? closeOnEscapeKeyDownCapture
                      : closeOnEscapeKeyDown,
                    escapeKeyCapture,
                  ),
                  doc.removeEventListener(
                    "compositionstart",
                    handleCompositionStart,
                  ),
                  doc.removeEventListener(
                    "compositionend",
                    handleCompositionEnd,
                  )),
                  outsidePress &&
                    doc.removeEventListener(
                      outsidePressEvent,
                      outsidePressCapture
                        ? closeOnPressOutsideCapture
                        : closeOnPressOutside,
                      outsidePressCapture,
                    ),
                  ancestors.forEach((ancestor) => {
                    ancestor.removeEventListener("scroll", onScroll);
                  }),
                  window.clearTimeout(compositionTimeout);
              }
            );
          }, [
            dataRef,
            elements,
            escapeKey,
            outsidePress,
            outsidePressEvent,
            open,
            onOpenChange,
            ancestorScroll,
            enabled,
            escapeKeyBubbles,
            outsidePressBubbles,
            closeOnEscapeKeyDown,
            escapeKeyCapture,
            closeOnEscapeKeyDownCapture,
            closeOnPressOutside,
            outsidePressCapture,
            closeOnPressOutsideCapture,
          ]),
            react.useEffect(() => {
              insideReactTreeRef.current = !1;
            }, [outsidePress, outsidePressEvent]);
          const reference = react.useMemo(
              () => ({
                onKeyDown: closeOnEscapeKeyDown,
                [bubbleHandlerKeys[referencePressEvent]]: (event) => {
                  referencePress &&
                    onOpenChange(!1, event.nativeEvent, "reference-press");
                },
              }),
              [
                closeOnEscapeKeyDown,
                onOpenChange,
                referencePress,
                referencePressEvent,
              ],
            ),
            floating = react.useMemo(
              () => ({
                onKeyDown: closeOnEscapeKeyDown,
                onMouseDown() {
                  endedOrStartedInsideRef.current = !0;
                },
                onMouseUp() {
                  endedOrStartedInsideRef.current = !0;
                },
                [captureHandlerKeys[outsidePressEvent]]: () => {
                  insideReactTreeRef.current = !0;
                },
              }),
              [closeOnEscapeKeyDown, outsidePressEvent],
            );
          return react.useMemo(
            () => (enabled ? { reference, floating } : {}),
            [enabled, reference, floating],
          );
        }
        function floating_ui_react_useFloating(options) {
          void 0 === options && (options = {});
          const { nodeId } = options,
            internalRootContext = (function useFloatingRootContext(options) {
              const {
                  open = !1,
                  onOpenChange: onOpenChangeProp,
                  elements: elementsProp,
                } = options,
                floatingId = useId(),
                dataRef = react.useRef({}),
                [events] = react.useState(() => createPubSub()),
                nested = null != useFloatingParentNodeId(),
                [positionReference, setPositionReference] = react.useState(
                  elementsProp.reference,
                ),
                onOpenChange = useEffectEvent((open, event, reason) => {
                  (dataRef.current.openEvent = open ? event : void 0),
                    events.emit("openchange", { open, event, reason, nested }),
                    null == onOpenChangeProp ||
                      onOpenChangeProp(open, event, reason);
                }),
                refs = react.useMemo(() => ({ setPositionReference }), []),
                elements = react.useMemo(
                  () => ({
                    reference:
                      positionReference || elementsProp.reference || null,
                    floating: elementsProp.floating || null,
                    domReference: elementsProp.reference,
                  }),
                  [
                    positionReference,
                    elementsProp.reference,
                    elementsProp.floating,
                  ],
                );
              return react.useMemo(
                () => ({
                  dataRef,
                  open,
                  onOpenChange,
                  elements,
                  events,
                  floatingId,
                  refs,
                }),
                [open, onOpenChange, elements, events, floatingId, refs],
              );
            })({
              ...options,
              elements: {
                reference: null,
                floating: null,
                ...options.elements,
              },
            }),
            rootContext = options.rootContext || internalRootContext,
            computedElements = rootContext.elements,
            [_domReference, setDomReference] = react.useState(null),
            [positionReference, _setPositionReference] = react.useState(null),
            domReference =
              (null == computedElements
                ? void 0
                : computedElements.domReference) || _domReference,
            domReferenceRef = react.useRef(null),
            tree = useFloatingTree();
          floating_ui_react_index(() => {
            domReference && (domReferenceRef.current = domReference);
          }, [domReference]);
          const position = (function useFloating(options) {
              void 0 === options && (options = {});
              const {
                  placement = "bottom",
                  strategy = "absolute",
                  middleware = [],
                  platform,
                  elements: {
                    reference: externalReference,
                    floating: externalFloating,
                  } = {},
                  transform = !0,
                  whileElementsMounted,
                  open,
                } = options,
                [data, setData] = react.useState({
                  x: 0,
                  y: 0,
                  strategy,
                  placement,
                  middlewareData: {},
                  isPositioned: !1,
                }),
                [latestMiddleware, setLatestMiddleware] =
                  react.useState(middleware);
              deepEqual(latestMiddleware, middleware) ||
                setLatestMiddleware(middleware);
              const [_reference, _setReference] = react.useState(null),
                [_floating, _setFloating] = react.useState(null),
                setReference = react.useCallback((node) => {
                  node !== referenceRef.current &&
                    ((referenceRef.current = node), _setReference(node));
                }, []),
                setFloating = react.useCallback((node) => {
                  node !== floatingRef.current &&
                    ((floatingRef.current = node), _setFloating(node));
                }, []),
                referenceEl = externalReference || _reference,
                floatingEl = externalFloating || _floating,
                referenceRef = react.useRef(null),
                floatingRef = react.useRef(null),
                dataRef = react.useRef(data),
                hasWhileElementsMounted = null != whileElementsMounted,
                whileElementsMountedRef = useLatestRef(whileElementsMounted),
                platformRef = useLatestRef(platform),
                openRef = useLatestRef(open),
                update = react.useCallback(() => {
                  if (!referenceRef.current || !floatingRef.current) return;
                  const config = {
                    placement,
                    strategy,
                    middleware: latestMiddleware,
                  };
                  platformRef.current &&
                    (config.platform = platformRef.current),
                    floating_ui_dom_computePosition(
                      referenceRef.current,
                      floatingRef.current,
                      config,
                    ).then((data) => {
                      const fullData = {
                        ...data,
                        isPositioned: !1 !== openRef.current,
                      };
                      isMountedRef.current &&
                        !deepEqual(dataRef.current, fullData) &&
                        ((dataRef.current = fullData),
                        react_dom.flushSync(() => {
                          setData(fullData);
                        }));
                    });
                }, [
                  latestMiddleware,
                  placement,
                  strategy,
                  platformRef,
                  openRef,
                ]);
              index(() => {
                !1 === open &&
                  dataRef.current.isPositioned &&
                  ((dataRef.current.isPositioned = !1),
                  setData((data) => ({ ...data, isPositioned: !1 })));
              }, [open]);
              const isMountedRef = react.useRef(!1);
              index(
                () => (
                  (isMountedRef.current = !0),
                  () => {
                    isMountedRef.current = !1;
                  }
                ),
                [],
              ),
                index(() => {
                  if (
                    (referenceEl && (referenceRef.current = referenceEl),
                    floatingEl && (floatingRef.current = floatingEl),
                    referenceEl && floatingEl)
                  ) {
                    if (whileElementsMountedRef.current)
                      return whileElementsMountedRef.current(
                        referenceEl,
                        floatingEl,
                        update,
                      );
                    update();
                  }
                }, [
                  referenceEl,
                  floatingEl,
                  update,
                  whileElementsMountedRef,
                  hasWhileElementsMounted,
                ]);
              const refs = react.useMemo(
                  () => ({
                    reference: referenceRef,
                    floating: floatingRef,
                    setReference,
                    setFloating,
                  }),
                  [setReference, setFloating],
                ),
                elements = react.useMemo(
                  () => ({ reference: referenceEl, floating: floatingEl }),
                  [referenceEl, floatingEl],
                ),
                floatingStyles = react.useMemo(() => {
                  const initialStyles = { position: strategy, left: 0, top: 0 };
                  if (!elements.floating) return initialStyles;
                  const x = roundByDPR(elements.floating, data.x),
                    y = roundByDPR(elements.floating, data.y);
                  return transform
                    ? {
                        ...initialStyles,
                        transform: "translate(" + x + "px, " + y + "px)",
                        ...(getDPR(elements.floating) >= 1.5 && {
                          willChange: "transform",
                        }),
                      }
                    : { position: strategy, left: x, top: y };
                }, [strategy, transform, elements.floating, data.x, data.y]);
              return react.useMemo(
                () => ({ ...data, update, refs, elements, floatingStyles }),
                [data, update, refs, elements, floatingStyles],
              );
            })({
              ...options,
              elements: {
                ...computedElements,
                ...(positionReference && { reference: positionReference }),
              },
            }),
            setPositionReference = react.useCallback(
              (node) => {
                const computedPositionReference =
                  floating_ui_utils_dom_isElement(node)
                    ? {
                        getBoundingClientRect: () =>
                          node.getBoundingClientRect(),
                        contextElement: node,
                      }
                    : node;
                _setPositionReference(computedPositionReference),
                  position.refs.setReference(computedPositionReference);
              },
              [position.refs],
            ),
            setReference = react.useCallback(
              (node) => {
                (floating_ui_utils_dom_isElement(node) || null === node) &&
                  ((domReferenceRef.current = node), setDomReference(node)),
                  (floating_ui_utils_dom_isElement(
                    position.refs.reference.current,
                  ) ||
                    null === position.refs.reference.current ||
                    (null !== node &&
                      !floating_ui_utils_dom_isElement(node))) &&
                    position.refs.setReference(node);
              },
              [position.refs],
            ),
            refs = react.useMemo(
              () => ({
                ...position.refs,
                setReference,
                setPositionReference,
                domReference: domReferenceRef,
              }),
              [position.refs, setReference, setPositionReference],
            ),
            elements = react.useMemo(
              () => ({ ...position.elements, domReference }),
              [position.elements, domReference],
            ),
            context = react.useMemo(
              () => ({ ...position, ...rootContext, refs, elements, nodeId }),
              [position, refs, elements, nodeId, rootContext],
            );
          return (
            floating_ui_react_index(() => {
              rootContext.dataRef.current.floatingContext = context;
              const node =
                null == tree
                  ? void 0
                  : tree.nodesRef.current.find((node) => node.id === nodeId);
              node && (node.context = context);
            }),
            react.useMemo(
              () => ({ ...position, context, refs, elements }),
              [position, refs, elements, context],
            )
          );
        }
        function useFocus(context, props) {
          void 0 === props && (props = {});
          const { open, onOpenChange, events, dataRef, elements } = context,
            { enabled = !0, visibleOnly = !0 } = props,
            blockFocusRef = react.useRef(!1),
            timeoutRef = react.useRef(),
            keyboardModalityRef = react.useRef(!0);
          react.useEffect(() => {
            if (!enabled) return;
            const win = floating_ui_utils_dom_getWindow(elements.domReference);
            function onBlur() {
              !open &&
                floating_ui_utils_dom_isHTMLElement(elements.domReference) &&
                elements.domReference ===
                  floating_ui_react_utils_activeElement(
                    floating_ui_react_utils_getDocument(elements.domReference),
                  ) &&
                (blockFocusRef.current = !0);
            }
            function onKeyDown() {
              keyboardModalityRef.current = !0;
            }
            return (
              win.addEventListener("blur", onBlur),
              win.addEventListener("keydown", onKeyDown, !0),
              () => {
                win.removeEventListener("blur", onBlur),
                  win.removeEventListener("keydown", onKeyDown, !0);
              }
            );
          }, [elements.domReference, open, enabled]),
            react.useEffect(() => {
              if (enabled)
                return (
                  events.on("openchange", onOpenChange),
                  () => {
                    events.off("openchange", onOpenChange);
                  }
                );
              function onOpenChange(_ref) {
                let { reason } = _ref;
                ("reference-press" !== reason && "escape-key" !== reason) ||
                  (blockFocusRef.current = !0);
              }
            }, [events, enabled]),
            react.useEffect(
              () => () => {
                clearTimeout(timeoutRef.current);
              },
              [],
            );
          const reference = react.useMemo(
            () => ({
              onPointerDown(event) {
                floating_ui_react_utils_isVirtualPointerEvent(
                  event.nativeEvent,
                ) || (keyboardModalityRef.current = !1);
              },
              onMouseLeave() {
                blockFocusRef.current = !1;
              },
              onFocus(event) {
                if (blockFocusRef.current) return;
                const target = floating_ui_react_utils_getTarget(
                  event.nativeEvent,
                );
                if (visibleOnly && floating_ui_utils_dom_isElement(target))
                  try {
                    if (
                      (function floating_ui_react_utils_isSafari() {
                        return /apple/i.test(navigator.vendor);
                      })() &&
                      (function floating_ui_react_utils_isMac() {
                        return (
                          floating_ui_react_utils_getPlatform()
                            .toLowerCase()
                            .startsWith("mac") && !navigator.maxTouchPoints
                        );
                      })()
                    )
                      throw Error();
                    if (!target.matches(":focus-visible")) return;
                  } catch (e) {
                    if (
                      !keyboardModalityRef.current &&
                      !floating_ui_react_utils_isTypeableElement(target)
                    )
                      return;
                  }
                onOpenChange(!0, event.nativeEvent, "focus");
              },
              onBlur(event) {
                blockFocusRef.current = !1;
                const relatedTarget = event.relatedTarget,
                  nativeEvent = event.nativeEvent,
                  movedToFocusGuard =
                    floating_ui_utils_dom_isElement(relatedTarget) &&
                    relatedTarget.hasAttribute(
                      createAttribute("focus-guard"),
                    ) &&
                    "outside" === relatedTarget.getAttribute("data-type");
                timeoutRef.current = window.setTimeout(() => {
                  var _dataRef$current$floa;
                  const activeEl = floating_ui_react_utils_activeElement(
                    elements.domReference
                      ? elements.domReference.ownerDocument
                      : document,
                  );
                  (relatedTarget || activeEl !== elements.domReference) &&
                    (floating_ui_react_utils_contains(
                      null ==
                        (_dataRef$current$floa =
                          dataRef.current.floatingContext)
                        ? void 0
                        : _dataRef$current$floa.refs.floating.current,
                      activeEl,
                    ) ||
                      floating_ui_react_utils_contains(
                        elements.domReference,
                        activeEl,
                      ) ||
                      movedToFocusGuard ||
                      onOpenChange(!1, nativeEvent, "focus"));
                });
              },
            }),
            [dataRef, elements.domReference, onOpenChange, visibleOnly],
          );
          return react.useMemo(
            () => (enabled ? { reference } : {}),
            [enabled, reference],
          );
        }
        const ACTIVE_KEY = "active",
          SELECTED_KEY = "selected";
        function mergeProps(userProps, propsList, elementKey) {
          const map = new Map(),
            isItem = "item" === elementKey;
          let domUserProps = userProps;
          if (isItem && userProps) {
            const {
              [ACTIVE_KEY]: _,
              [SELECTED_KEY]: __,
              ...validProps
            } = userProps;
            domUserProps = validProps;
          }
          return {
            ...("floating" === elementKey && {
              tabIndex: -1,
              [FOCUSABLE_ATTRIBUTE]: "",
            }),
            ...domUserProps,
            ...propsList
              .map((value) => {
                const propsOrGetProps = value ? value[elementKey] : null;
                return "function" == typeof propsOrGetProps
                  ? userProps
                    ? propsOrGetProps(userProps)
                    : null
                  : propsOrGetProps;
              })
              .concat(userProps)
              .reduce(
                (acc, props) =>
                  props
                    ? (Object.entries(props).forEach((_ref) => {
                        let [key, value] = _ref;
                        var _map$get;
                        (isItem && [ACTIVE_KEY, SELECTED_KEY].includes(key)) ||
                          (0 === key.indexOf("on")
                            ? (map.has(key) || map.set(key, []),
                              "function" == typeof value &&
                                (null == (_map$get = map.get(key)) ||
                                  _map$get.push(value),
                                (acc[key] = function () {
                                  for (
                                    var _map$get2,
                                      _len = arguments.length,
                                      args = new Array(_len),
                                      _key = 0;
                                    _key < _len;
                                    _key++
                                  )
                                    args[_key] = arguments[_key];
                                  return null == (_map$get2 = map.get(key))
                                    ? void 0
                                    : _map$get2
                                        .map((fn) => fn(...args))
                                        .find((val) => void 0 !== val);
                                })))
                            : (acc[key] = value));
                      }),
                      acc)
                    : acc,
                {},
              ),
          };
        }
        const componentRoleToAriaRoleMap = new Map([
          ["select", "listbox"],
          ["combobox", "listbox"],
          ["label", !1],
        ]);
        function useRole(context, props) {
          var _componentRoleToAriaR;
          void 0 === props && (props = {});
          const { open, floatingId } = context,
            { enabled = !0, role = "dialog" } = props,
            ariaRole =
              null !=
              (_componentRoleToAriaR = componentRoleToAriaRoleMap.get(role))
                ? _componentRoleToAriaR
                : role,
            referenceId = useId(),
            isNested = null != useFloatingParentNodeId(),
            reference = react.useMemo(
              () =>
                "tooltip" === ariaRole || "label" === role
                  ? {
                      ["aria-" +
                      ("label" === role ? "labelledby" : "describedby")]: open
                        ? floatingId
                        : void 0,
                    }
                  : {
                      "aria-expanded": open ? "true" : "false",
                      "aria-haspopup":
                        "alertdialog" === ariaRole ? "dialog" : ariaRole,
                      "aria-controls": open ? floatingId : void 0,
                      ...("listbox" === ariaRole && { role: "combobox" }),
                      ...("menu" === ariaRole && { id: referenceId }),
                      ...("menu" === ariaRole &&
                        isNested && { role: "menuitem" }),
                      ...("select" === role && { "aria-autocomplete": "none" }),
                      ...("combobox" === role && {
                        "aria-autocomplete": "list",
                      }),
                    },
              [ariaRole, floatingId, isNested, open, referenceId, role],
            ),
            floating = react.useMemo(() => {
              const floatingProps = {
                id: floatingId,
                ...(ariaRole && { role: ariaRole }),
              };
              return "tooltip" === ariaRole || "label" === role
                ? floatingProps
                : {
                    ...floatingProps,
                    ...("menu" === ariaRole && {
                      "aria-labelledby": referenceId,
                    }),
                  };
            }, [ariaRole, floatingId, referenceId, role]),
            item = react.useCallback(
              (_ref) => {
                let { active, selected } = _ref;
                const commonProps = {
                  role: "option",
                  ...(active && { id: floatingId + "-option" }),
                };
                switch (role) {
                  case "select":
                    return {
                      ...commonProps,
                      "aria-selected": active && selected,
                    };
                  case "combobox":
                    return {
                      ...commonProps,
                      ...(active && { "aria-selected": !0 }),
                    };
                }
                return {};
              },
              [floatingId, role],
            );
          return react.useMemo(
            () => (enabled ? { reference, floating, item } : {}),
            [enabled, reference, floating, item],
          );
        }
        var classes = { tooltip: "m_1b3c8819", arrow: "m_f898399f" };
        const TooltipFloating_defaultProps = {
            refProp: "ref",
            withinPortal: !0,
            offset: 10,
            defaultOpened: !1,
            position: "right",
            zIndex: getDefaultZIndex("popover"),
          },
          varsResolver = (0, create_vars_resolver.V)(
            (theme, { radius, color }) => ({
              tooltip: {
                "--tooltip-radius":
                  void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                "--tooltip-bg": color
                  ? (0, get_theme_color.r)(color, theme)
                  : void 0,
                "--tooltip-color": color
                  ? "var(--mantine-color-white)"
                  : void 0,
              },
            }),
          ),
          TooltipFloating = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "TooltipFloating",
                TooltipFloating_defaultProps,
                _props,
              ),
              {
                children,
                refProp,
                withinPortal,
                style,
                className,
                classNames,
                styles,
                unstyled,
                radius,
                color,
                label,
                offset,
                position,
                multiline,
                zIndex,
                disabled,
                defaultOpened,
                variant,
                vars,
                portalProps,
                ...others
              } = props,
              theme = (0, MantineThemeProvider.xd)(),
              getStyles = (0, use_styles.I)({
                name: "TooltipFloating",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                rootSelector: "tooltip",
                vars,
                varsResolver,
              }),
              {
                handleMouseMove,
                x,
                y,
                opened,
                boundaryRef,
                floating,
                setOpened,
              } = (function useFloatingTooltip({
                offset,
                position,
                defaultOpened,
              }) {
                const [opened, setOpened] = (0, react.useState)(defaultOpened),
                  boundaryRef = (0, react.useRef)(null),
                  { x, y, elements, refs, update, placement } =
                    floating_ui_react_useFloating({
                      placement: position,
                      middleware: [
                        floating_ui_react_dom_shift({
                          crossAxis: !0,
                          padding: 5,
                          rootBoundary: "document",
                        }),
                      ],
                    }),
                  horizontalOffset = placement.includes("right")
                    ? offset
                    : position.includes("left")
                      ? -1 * offset
                      : 0,
                  verticalOffset = placement.includes("bottom")
                    ? offset
                    : position.includes("top")
                      ? -1 * offset
                      : 0,
                  handleMouseMove = (0, react.useCallback)(
                    ({ clientX, clientY }) => {
                      refs.setPositionReference({
                        getBoundingClientRect: () => ({
                          width: 0,
                          height: 0,
                          x: clientX,
                          y: clientY,
                          left: clientX + horizontalOffset,
                          top: clientY + verticalOffset,
                          right: clientX,
                          bottom: clientY,
                        }),
                      });
                    },
                    [elements.reference],
                  );
                return (
                  (0, react.useEffect)(() => {
                    if (refs.floating.current) {
                      const boundary = boundaryRef.current;
                      boundary.addEventListener("mousemove", handleMouseMove);
                      const parents = getOverflowAncestors(
                        refs.floating.current,
                      );
                      return (
                        parents.forEach((parent) => {
                          parent.addEventListener("scroll", update);
                        }),
                        () => {
                          boundary.removeEventListener(
                            "mousemove",
                            handleMouseMove,
                          ),
                            parents.forEach((parent) => {
                              parent.removeEventListener("scroll", update);
                            });
                        }
                      );
                    }
                  }, [
                    elements.reference,
                    refs.floating.current,
                    update,
                    handleMouseMove,
                    opened,
                  ]),
                  {
                    handleMouseMove,
                    x,
                    y,
                    opened,
                    setOpened,
                    boundaryRef,
                    floating: refs.setFloating,
                  }
                );
              })({ offset, position, defaultOpened });
            if (!is_element_isElement(children))
              throw new Error(
                "[@mantine/core] Tooltip.Floating component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported",
              );
            const targetRef = useMergedRef(
                boundaryRef,
                getRefProp(children),
                ref,
              ),
              _childrenProps = children.props;
            return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
              children: [
                (0, jsx_runtime.jsx)(OptionalPortal, {
                  ...portalProps,
                  withinPortal,
                  children: (0, jsx_runtime.jsx)(Box.a, {
                    ...others,
                    ...getStyles("tooltip", {
                      style: {
                        ...getStyleObject(style, theme),
                        zIndex,
                        display: !disabled && opened ? "block" : "none",
                        top: (y && Math.round(y)) ?? "",
                        left: (x && Math.round(x)) ?? "",
                      },
                    }),
                    variant,
                    ref: floating,
                    mod: { multiline },
                    children: label,
                  }),
                }),
                (0, react.cloneElement)(children, {
                  ..._childrenProps,
                  [refProp]: targetRef,
                  onMouseEnter: (event) => {
                    _childrenProps.onMouseEnter?.(event),
                      handleMouseMove(event),
                      setOpened(!0);
                  },
                  onMouseLeave: (event) => {
                    _childrenProps.onMouseLeave?.(event), setOpened(!1);
                  },
                }),
              ],
            });
          });
        (TooltipFloating.classes = classes),
          (TooltipFloating.displayName = "@mantine/core/TooltipFloating");
        const TooltipGroupContext = (0, react.createContext)(!1),
          TooltipGroupProvider = TooltipGroupContext.Provider,
          TooltipGroup_defaultProps = { openDelay: 0, closeDelay: 0 };
        function TooltipGroup(props) {
          const { openDelay, closeDelay, children } = (0, use_props.Y)(
            "TooltipGroup",
            TooltipGroup_defaultProps,
            props,
          );
          return (0, jsx_runtime.jsx)(TooltipGroupProvider, {
            value: !0,
            children: (0, jsx_runtime.jsx)(FloatingDelayGroup, {
              delay: { open: openDelay, close: closeDelay },
              children,
            }),
          });
        }
        (TooltipGroup.displayName = "@mantine/core/TooltipGroup"),
          (TooltipGroup.extend = (c) => c);
        var use_id = __webpack_require__(
            "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-id/use-id.mjs",
          ),
          use_did_update = __webpack_require__(
            "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-did-update/use-did-update.mjs",
          );
        function getTooltipMiddlewares(settings) {
          const middlewaresOptions = (function getDefaultMiddlewares(
              middlewares,
            ) {
              if (void 0 === middlewares) return { shift: !0, flip: !0 };
              const result = { ...middlewares };
              return (
                void 0 === middlewares.shift && (result.shift = !0),
                void 0 === middlewares.flip && (result.flip = !0),
                result
              );
            })(settings.middlewares),
            middlewares = [
              ((options = settings.offset),
              { ...floating_ui_dom_offset(options), options: [options, deps] }),
            ];
          var options, deps;
          return (
            middlewaresOptions.shift &&
              middlewares.push(
                floating_ui_react_dom_shift(
                  "boolean" == typeof middlewaresOptions.shift
                    ? { padding: 8 }
                    : { padding: 8, ...middlewaresOptions.shift },
                ),
              ),
            middlewaresOptions.flip &&
              middlewares.push(
                "boolean" == typeof middlewaresOptions.flip
                  ? floating_ui_react_dom_flip()
                  : floating_ui_react_dom_flip(middlewaresOptions.flip),
              ),
            middlewares.push(
              ((options, deps) => ({
                ...arrow$1(options),
                options: [options, deps],
              }))({
                element: settings.arrowRef,
                padding: settings.arrowOffset,
              }),
            ),
            middlewaresOptions.inline
              ? middlewares.push(
                  "boolean" == typeof middlewaresOptions.inline
                    ? floating_ui_react_dom_inline()
                    : floating_ui_react_dom_inline(middlewaresOptions.inline),
                )
              : settings.inline &&
                middlewares.push(floating_ui_react_dom_inline()),
            middlewares
          );
        }
        function useTooltip(settings) {
          const [uncontrolledOpened, setUncontrolledOpened] = (0,
            react.useState)(settings.defaultOpened),
            opened =
              "boolean" == typeof settings.opened
                ? settings.opened
                : uncontrolledOpened,
            withinGroup = (0, react.useContext)(TooltipGroupContext),
            uid = (0, use_id.B)(),
            onChange = (0, react.useCallback)(
              (_opened) => {
                setUncontrolledOpened(_opened), _opened && setCurrentId(uid);
              },
              [uid],
            ),
            {
              x,
              y,
              context,
              refs,
              update,
              placement,
              middlewareData: { arrow: { x: arrowX, y: arrowY } = {} },
            } = floating_ui_react_useFloating({
              strategy: settings.strategy,
              placement: settings.position,
              open: opened,
              onOpenChange: onChange,
              middleware: getTooltipMiddlewares(settings),
            }),
            {
              delay: groupDelay,
              currentId,
              setCurrentId,
            } = useDelayGroup(context, { id: uid }),
            { getReferenceProps, getFloatingProps } = (function useInteractions(
              propsList,
            ) {
              void 0 === propsList && (propsList = []);
              const referenceDeps = propsList.map((key) =>
                  null == key ? void 0 : key.reference,
                ),
                floatingDeps = propsList.map((key) =>
                  null == key ? void 0 : key.floating,
                ),
                itemDeps = propsList.map((key) =>
                  null == key ? void 0 : key.item,
                ),
                getReferenceProps = react.useCallback(
                  (userProps) => mergeProps(userProps, propsList, "reference"),
                  referenceDeps,
                ),
                getFloatingProps = react.useCallback(
                  (userProps) => mergeProps(userProps, propsList, "floating"),
                  floatingDeps,
                ),
                getItemProps = react.useCallback(
                  (userProps) => mergeProps(userProps, propsList, "item"),
                  itemDeps,
                );
              return react.useMemo(
                () => ({ getReferenceProps, getFloatingProps, getItemProps }),
                [getReferenceProps, getFloatingProps, getItemProps],
              );
            })([
              useHover(context, {
                enabled: settings.events?.hover,
                delay: withinGroup
                  ? groupDelay
                  : { open: settings.openDelay, close: settings.closeDelay },
                mouseOnly: !settings.events?.touch,
              }),
              useFocus(context, {
                enabled: settings.events?.focus,
                visibleOnly: !0,
              }),
              useRole(context, { role: "tooltip" }),
              useDismiss(context, { enabled: void 0 === settings.opened }),
            ]);
          !(function useFloatingAutoUpdate({
            opened,
            floating,
            position,
            positionDependencies,
          }) {
            const [delayedUpdate, setDelayedUpdate] = (0, react.useState)(0);
            (0, react.useEffect)(() => {
              if (
                floating.refs.reference.current &&
                floating.refs.floating.current &&
                opened
              )
                return autoUpdate(
                  floating.refs.reference.current,
                  floating.refs.floating.current,
                  floating.update,
                );
            }, [
              floating.refs.reference.current,
              floating.refs.floating.current,
              opened,
              delayedUpdate,
              position,
            ]),
              (0, use_did_update.C)(() => {
                floating.update();
              }, positionDependencies),
              (0, use_did_update.C)(() => {
                setDelayedUpdate((c) => c + 1);
              }, [opened]);
          })({
            opened,
            position: settings.position,
            positionDependencies: settings.positionDependencies,
            floating: { refs, update },
          }),
            (0, use_did_update.C)(() => {
              settings.onPositionChange?.(placement);
            }, [placement]);
          const isGroupPhase = opened && currentId && currentId !== uid;
          return {
            x,
            y,
            arrowX,
            arrowY,
            reference: refs.setReference,
            floating: refs.setFloating,
            getFloatingProps,
            getReferenceProps,
            isGroupPhase,
            opened,
            placement,
          };
        }
        const Tooltip_defaultProps = {
            position: "top",
            refProp: "ref",
            withinPortal: !0,
            inline: !1,
            defaultOpened: !1,
            arrowSize: 4,
            arrowOffset: 5,
            arrowRadius: 0,
            arrowPosition: "side",
            offset: 5,
            transitionProps: { duration: 100, transition: "fade" },
            events: { hover: !0, focus: !1, touch: !1 },
            zIndex: getDefaultZIndex("popover"),
            positionDependencies: [],
            middlewares: { flip: !0, shift: !0, inline: !1 },
          },
          Tooltip_varsResolver = (0, create_vars_resolver.V)(
            (theme, { radius, color }) => ({
              tooltip: {
                "--tooltip-radius":
                  void 0 === radius ? void 0 : (0, get_size.nJ)(radius),
                "--tooltip-bg": color
                  ? (0, get_theme_color.r)(color, theme)
                  : void 0,
                "--tooltip-color": color
                  ? "var(--mantine-color-white)"
                  : void 0,
              },
            }),
          ),
          Tooltip = (0, factory.P9)((_props, ref) => {
            const props = (0, use_props.Y)(
                "Tooltip",
                Tooltip_defaultProps,
                _props,
              ),
              {
                children,
                position,
                refProp,
                label,
                openDelay,
                closeDelay,
                onPositionChange,
                opened,
                defaultOpened,
                withinPortal,
                radius,
                color,
                classNames,
                styles,
                unstyled,
                style,
                className,
                withArrow,
                arrowSize,
                arrowOffset,
                arrowRadius,
                arrowPosition,
                offset,
                transitionProps,
                multiline,
                events,
                zIndex,
                disabled,
                positionDependencies,
                onClick,
                onMouseEnter,
                onMouseLeave,
                inline,
                variant,
                keepMounted,
                vars,
                portalProps,
                mod,
                floatingStrategy,
                middlewares,
                ...others
              } = (0, use_props.Y)("Tooltip", Tooltip_defaultProps, props),
              { dir } = useDirection(),
              arrowRef = (0, react.useRef)(null),
              tooltip = useTooltip({
                position: getFloatingPosition(dir, position),
                closeDelay,
                openDelay,
                onPositionChange,
                opened,
                defaultOpened,
                events,
                arrowRef,
                arrowOffset,
                offset:
                  "number" == typeof offset
                    ? offset + (withArrow ? arrowSize / 2 : 0)
                    : offset,
                positionDependencies: [...positionDependencies, children],
                inline,
                strategy: floatingStrategy,
                middlewares,
              }),
              getStyles = (0, use_styles.I)({
                name: "Tooltip",
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
                rootSelector: "tooltip",
                vars,
                varsResolver: Tooltip_varsResolver,
              });
            if (!is_element_isElement(children))
              throw new Error(
                "[@mantine/core] Tooltip component children should be an element or a component that accepts ref, fragments, strings, numbers and other primitive values are not supported",
              );
            const targetRef = useMergedRef(
                tooltip.reference,
                getRefProp(children),
                ref,
              ),
              transition = (function getTransitionProps(
                transitionProps,
                componentTransition,
              ) {
                return {
                  ...defaultTransition,
                  ...componentTransition,
                  ...transitionProps,
                };
              })(transitionProps, { duration: 100, transition: "fade" }),
              _childrenProps = children.props;
            return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
              children: [
                (0, jsx_runtime.jsx)(OptionalPortal, {
                  ...portalProps,
                  withinPortal,
                  children: (0, jsx_runtime.jsx)(Transition.e, {
                    ...transition,
                    keepMounted,
                    mounted: !disabled && !!tooltip.opened,
                    duration: tooltip.isGroupPhase ? 10 : transition.duration,
                    children: (transitionStyles) =>
                      (0, jsx_runtime.jsxs)(Box.a, {
                        ...others,
                        "data-fixed": "fixed" === floatingStrategy || void 0,
                        variant,
                        mod: [{ multiline }, mod],
                        ...tooltip.getFloatingProps({
                          ref: tooltip.floating,
                          className: getStyles("tooltip").className,
                          style: {
                            ...getStyles("tooltip").style,
                            ...transitionStyles,
                            zIndex,
                            top: tooltip.y ?? 0,
                            left: tooltip.x ?? 0,
                          },
                        }),
                        children: [
                          label,
                          (0, jsx_runtime.jsx)(FloatingArrow, {
                            ref: arrowRef,
                            arrowX: tooltip.arrowX,
                            arrowY: tooltip.arrowY,
                            visible: withArrow,
                            position: tooltip.placement,
                            arrowSize,
                            arrowOffset,
                            arrowRadius,
                            arrowPosition,
                            ...getStyles("arrow"),
                          }),
                        ],
                      }),
                  }),
                }),
                (0, react.cloneElement)(
                  children,
                  tooltip.getReferenceProps({
                    onClick,
                    onMouseEnter,
                    onMouseLeave,
                    onMouseMove: props.onMouseMove,
                    onPointerDown: props.onPointerDown,
                    onPointerEnter: props.onPointerEnter,
                    className: (0, clsx.A)(className, _childrenProps.className),
                    ..._childrenProps,
                    [refProp]: targetRef,
                  }),
                ),
              ],
            });
          });
        (Tooltip.classes = classes),
          (Tooltip.displayName = "@mantine/core/Tooltip"),
          (Tooltip.Floating = TooltipFloating),
          (Tooltip.Group = TooltipGroup);
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/Transition/Transition.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { e: () => Transition });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          Mantine_context = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs",
          );
        const popIn = (from) => ({
            in: { opacity: 1, transform: "scale(1)" },
            out: {
              opacity: 0,
              transform: `scale(.9) translateY(${"bottom" === from ? 10 : -10}px)`,
            },
            transitionProperty: "transform, opacity",
          }),
          transitions = {
            fade: {
              in: { opacity: 1 },
              out: { opacity: 0 },
              transitionProperty: "opacity",
            },
            "fade-up": {
              in: { opacity: 1, transform: "translateY(0)" },
              out: { opacity: 0, transform: "translateY(30px)" },
              transitionProperty: "opacity, transform",
            },
            "fade-down": {
              in: { opacity: 1, transform: "translateY(0)" },
              out: { opacity: 0, transform: "translateY(-30px)" },
              transitionProperty: "opacity, transform",
            },
            "fade-left": {
              in: { opacity: 1, transform: "translateX(0)" },
              out: { opacity: 0, transform: "translateX(30px)" },
              transitionProperty: "opacity, transform",
            },
            "fade-right": {
              in: { opacity: 1, transform: "translateX(0)" },
              out: { opacity: 0, transform: "translateX(-30px)" },
              transitionProperty: "opacity, transform",
            },
            scale: {
              in: { opacity: 1, transform: "scale(1)" },
              out: { opacity: 0, transform: "scale(0)" },
              common: { transformOrigin: "top" },
              transitionProperty: "transform, opacity",
            },
            "scale-y": {
              in: { opacity: 1, transform: "scaleY(1)" },
              out: { opacity: 0, transform: "scaleY(0)" },
              common: { transformOrigin: "top" },
              transitionProperty: "transform, opacity",
            },
            "scale-x": {
              in: { opacity: 1, transform: "scaleX(1)" },
              out: { opacity: 0, transform: "scaleX(0)" },
              common: { transformOrigin: "left" },
              transitionProperty: "transform, opacity",
            },
            "skew-up": {
              in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
              out: {
                opacity: 0,
                transform: "translateY(-20px) skew(-10deg, -5deg)",
              },
              common: { transformOrigin: "top" },
              transitionProperty: "transform, opacity",
            },
            "skew-down": {
              in: { opacity: 1, transform: "translateY(0) skew(0deg, 0deg)" },
              out: {
                opacity: 0,
                transform: "translateY(20px) skew(-10deg, -5deg)",
              },
              common: { transformOrigin: "bottom" },
              transitionProperty: "transform, opacity",
            },
            "rotate-left": {
              in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
              out: { opacity: 0, transform: "translateY(20px) rotate(-5deg)" },
              common: { transformOrigin: "bottom" },
              transitionProperty: "transform, opacity",
            },
            "rotate-right": {
              in: { opacity: 1, transform: "translateY(0) rotate(0deg)" },
              out: { opacity: 0, transform: "translateY(20px) rotate(5deg)" },
              common: { transformOrigin: "top" },
              transitionProperty: "transform, opacity",
            },
            "slide-down": {
              in: { opacity: 1, transform: "translateY(0)" },
              out: { opacity: 0, transform: "translateY(-100%)" },
              common: { transformOrigin: "top" },
              transitionProperty: "transform, opacity",
            },
            "slide-up": {
              in: { opacity: 1, transform: "translateY(0)" },
              out: { opacity: 0, transform: "translateY(100%)" },
              common: { transformOrigin: "bottom" },
              transitionProperty: "transform, opacity",
            },
            "slide-left": {
              in: { opacity: 1, transform: "translateX(0)" },
              out: { opacity: 0, transform: "translateX(100%)" },
              common: { transformOrigin: "left" },
              transitionProperty: "transform, opacity",
            },
            "slide-right": {
              in: { opacity: 1, transform: "translateX(0)" },
              out: { opacity: 0, transform: "translateX(-100%)" },
              common: { transformOrigin: "right" },
              transitionProperty: "transform, opacity",
            },
            pop: {
              ...popIn("bottom"),
              common: { transformOrigin: "center center" },
            },
            "pop-bottom-left": {
              ...popIn("bottom"),
              common: { transformOrigin: "bottom left" },
            },
            "pop-bottom-right": {
              ...popIn("bottom"),
              common: { transformOrigin: "bottom right" },
            },
            "pop-top-left": {
              ...popIn("top"),
              common: { transformOrigin: "top left" },
            },
            "pop-top-right": {
              ...popIn("top"),
              common: { transformOrigin: "top right" },
            },
          },
          transitionStatuses = {
            entering: "in",
            entered: "in",
            exiting: "out",
            exited: "out",
            "pre-exiting": "out",
            "pre-entering": "out",
          };
        function getTransitionStyles({
          transition,
          state,
          duration,
          timingFunction,
        }) {
          const shared = {
            WebkitBackfaceVisibility: "hidden",
            willChange: "transform, opacity",
            transitionDuration: `${duration}ms`,
            transitionTimingFunction: timingFunction,
          };
          return "string" == typeof transition
            ? transition in transitions
              ? {
                  transitionProperty:
                    transitions[transition].transitionProperty,
                  ...shared,
                  ...transitions[transition].common,
                  ...transitions[transition][transitionStatuses[state]],
                }
              : {}
            : {
                transitionProperty: transition.transitionProperty,
                ...shared,
                ...transition.common,
                ...transition[transitionStatuses[state]],
              };
        }
        var react_dom = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react-dom/index.js",
        );
        function useMediaQuery(
          query,
          initialValue,
          { getInitialValueInEffect } = { getInitialValueInEffect: !0 },
        ) {
          const [matches, setMatches] = (0, react.useState)(
              getInitialValueInEffect
                ? initialValue
                : (function getInitialValue(query, initialValue) {
                    return (
                      "undefined" != typeof window &&
                      "matchMedia" in window &&
                      window.matchMedia(query).matches
                    );
                  })(query),
            ),
            queryRef = (0, react.useRef)(null);
          return (
            (0, react.useEffect)(() => {
              if ("matchMedia" in window)
                return (
                  (queryRef.current = window.matchMedia(query)),
                  setMatches(queryRef.current.matches),
                  (function attachMediaListener(query, callback) {
                    try {
                      return (
                        query.addEventListener("change", callback),
                        () => query.removeEventListener("change", callback)
                      );
                    } catch (e) {
                      return (
                        query.addListener(callback),
                        () => query.removeListener(callback)
                      );
                    }
                  })(queryRef.current, (event) => setMatches(event.matches))
                );
            }, [query]),
            matches
          );
        }
        var use_did_update = __webpack_require__(
            "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-did-update/use-did-update.mjs",
          ),
          MantineThemeProvider = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
          );
        function useTransition({
          duration,
          exitDuration,
          timingFunction,
          mounted,
          onEnter,
          onExit,
          onEntered,
          onExited,
          enterDelay,
          exitDelay,
        }) {
          const theme = (0, MantineThemeProvider.xd)(),
            shouldReduceMotion = (function useReducedMotion(
              initialValue,
              options,
            ) {
              return useMediaQuery(
                "(prefers-reduced-motion: reduce)",
                initialValue,
                options,
              );
            })(),
            reduceMotion = !!theme.respectReducedMotion && shouldReduceMotion,
            [transitionDuration, setTransitionDuration] = (0, react.useState)(
              reduceMotion ? 0 : duration,
            ),
            [transitionStatus, setStatus] = (0, react.useState)(
              mounted ? "entered" : "exited",
            ),
            transitionTimeoutRef = (0, react.useRef)(-1),
            delayTimeoutRef = (0, react.useRef)(-1),
            rafRef = (0, react.useRef)(-1),
            handleStateChange = (shouldMount) => {
              const preHandler = shouldMount ? onEnter : onExit,
                handler = shouldMount ? onEntered : onExited;
              window.clearTimeout(transitionTimeoutRef.current);
              const newTransitionDuration = reduceMotion
                ? 0
                : shouldMount
                  ? duration
                  : exitDuration;
              setTransitionDuration(newTransitionDuration),
                0 === newTransitionDuration
                  ? ("function" == typeof preHandler && preHandler(),
                    "function" == typeof handler && handler(),
                    setStatus(shouldMount ? "entered" : "exited"))
                  : (rafRef.current = requestAnimationFrame(() => {
                      react_dom.flushSync(() => {
                        setStatus(shouldMount ? "pre-entering" : "pre-exiting");
                      }),
                        (rafRef.current = requestAnimationFrame(() => {
                          "function" == typeof preHandler && preHandler(),
                            setStatus(shouldMount ? "entering" : "exiting"),
                            (transitionTimeoutRef.current = window.setTimeout(
                              () => {
                                "function" == typeof handler && handler(),
                                  setStatus(shouldMount ? "entered" : "exited");
                              },
                              newTransitionDuration,
                            ));
                        }));
                    }));
            };
          return (
            (0, use_did_update.C)(() => {
              var shouldMount;
              (shouldMount = mounted),
                window.clearTimeout(delayTimeoutRef.current),
                "number" == typeof (shouldMount ? enterDelay : exitDelay)
                  ? (delayTimeoutRef.current = window.setTimeout(
                      () => {
                        handleStateChange(shouldMount);
                      },
                      shouldMount ? enterDelay : exitDelay,
                    ))
                  : handleStateChange(shouldMount);
            }, [mounted]),
            (0, react.useEffect)(
              () => () => {
                window.clearTimeout(transitionTimeoutRef.current),
                  cancelAnimationFrame(rafRef.current);
              },
              [],
            ),
            {
              transitionDuration,
              transitionStatus,
              transitionTimingFunction: timingFunction || "ease",
            }
          );
        }
        function Transition({
          keepMounted,
          transition = "fade",
          duration = 250,
          exitDuration = duration,
          mounted,
          children,
          timingFunction = "ease",
          onExit,
          onEntered,
          onEnter,
          onExited,
          enterDelay,
          exitDelay,
        }) {
          const env = (0, Mantine_context.bv)(),
            { transitionDuration, transitionStatus, transitionTimingFunction } =
              useTransition({
                mounted,
                exitDuration,
                duration,
                timingFunction,
                onExit,
                onEntered,
                onEnter,
                onExited,
                enterDelay,
                exitDelay,
              });
          return 0 === transitionDuration || "test" === env
            ? mounted
              ? (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {
                  children: children({}),
                })
              : keepMounted
                ? children({ display: "none" })
                : null
            : "exited" === transitionStatus
              ? keepMounted
                ? children({ display: "none" })
                : null
              : (0, jsx_runtime.jsx)(jsx_runtime.Fragment, {
                  children: children(
                    getTransitionStyles({
                      transition,
                      duration: transitionDuration,
                      state: transitionStatus,
                      timingFunction: transitionTimingFunction,
                    }),
                  ),
                });
        }
        Transition.displayName = "@mantine/core/Transition";
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/components/UnstyledButton/UnstyledButton.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { N: () => UnstyledButton });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          use_props =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs",
            )),
          use_styles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs",
          ),
          Box = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs",
          ),
          polymorphic_factory = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs",
          ),
          classes = { root: "m_87cf2631" };
        const defaultProps = { __staticSelector: "UnstyledButton" },
          UnstyledButton = (0, polymorphic_factory.v)((_props, ref) => {
            const props = (0, use_props.Y)(
                "UnstyledButton",
                defaultProps,
                _props,
              ),
              {
                className,
                component = "button",
                __staticSelector,
                unstyled,
                classNames,
                styles,
                style,
                ...others
              } = props,
              getStyles = (0, use_styles.I)({
                name: __staticSelector,
                props,
                classes,
                className,
                style,
                classNames,
                styles,
                unstyled,
              });
            return (0, jsx_runtime.jsx)(Box.a, {
              ...getStyles("root", { focusable: !0 }),
              component,
              ref,
              type: "button" === component ? "button" : void 0,
              ...others,
            });
          });
        (UnstyledButton.classes = classes),
          (UnstyledButton.displayName = "@mantine/core/UnstyledButton");
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/Box.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { a: () => Box });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          clsx = __webpack_require__(
            "./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs",
          );
        var InlineStyles = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/InlineStyles/InlineStyles.mjs",
          ),
          is_number_like = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/is-number-like/is-number-like.mjs",
          ),
          Mantine_context = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs",
          ),
          MantineThemeProvider = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
          );
        function transformModKey(key) {
          return key.startsWith("data-") ? key : `data-${key}`;
        }
        function getBoxMod(mod) {
          return mod
            ? "string" == typeof mod
              ? { [transformModKey(mod)]: !0 }
              : Array.isArray(mod)
                ? [...mod].reduce(
                    (acc, value) => ({ ...acc, ...getBoxMod(value) }),
                    {},
                  )
                : (function getMod(props) {
                    return Object.keys(props).reduce((acc, key) => {
                      const value = props[key];
                      return (
                        void 0 === value ||
                          "" === value ||
                          !1 === value ||
                          null === value ||
                          (acc[transformModKey(key)] = props[key]),
                        acc
                      );
                    }, {});
                  })(mod)
            : null;
        }
        function mergeStyles(styles, theme) {
          return Array.isArray(styles)
            ? [...styles].reduce(
                (acc, item) => ({ ...acc, ...mergeStyles(item, theme) }),
                {},
              )
            : "function" == typeof styles
              ? styles(theme)
              : null == styles
                ? {}
                : styles;
        }
        function getBoxStyle({ theme, style, vars, styleProps }) {
          return {
            ...mergeStyles(style, theme),
            ...mergeStyles(vars, theme),
            ...styleProps,
          };
        }
        var extract_style_props = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/style-props/extract-style-props/extract-style-props.mjs",
        );
        const STYlE_PROPS_DATA = {
          m: { type: "spacing", property: "margin" },
          mt: { type: "spacing", property: "marginTop" },
          mb: { type: "spacing", property: "marginBottom" },
          ml: { type: "spacing", property: "marginLeft" },
          mr: { type: "spacing", property: "marginRight" },
          ms: { type: "spacing", property: "marginInlineStart" },
          me: { type: "spacing", property: "marginInlineEnd" },
          mx: { type: "spacing", property: "marginInline" },
          my: { type: "spacing", property: "marginBlock" },
          p: { type: "spacing", property: "padding" },
          pt: { type: "spacing", property: "paddingTop" },
          pb: { type: "spacing", property: "paddingBottom" },
          pl: { type: "spacing", property: "paddingLeft" },
          pr: { type: "spacing", property: "paddingRight" },
          ps: { type: "spacing", property: "paddingInlineStart" },
          pe: { type: "spacing", property: "paddingInlineEnd" },
          px: { type: "spacing", property: "paddingInline" },
          py: { type: "spacing", property: "paddingBlock" },
          bd: { type: "border", property: "border" },
          bg: { type: "color", property: "background" },
          c: { type: "textColor", property: "color" },
          opacity: { type: "identity", property: "opacity" },
          ff: { type: "fontFamily", property: "fontFamily" },
          fz: { type: "fontSize", property: "fontSize" },
          fw: { type: "identity", property: "fontWeight" },
          lts: { type: "size", property: "letterSpacing" },
          ta: { type: "identity", property: "textAlign" },
          lh: { type: "lineHeight", property: "lineHeight" },
          fs: { type: "identity", property: "fontStyle" },
          tt: { type: "identity", property: "textTransform" },
          td: { type: "identity", property: "textDecoration" },
          w: { type: "spacing", property: "width" },
          miw: { type: "spacing", property: "minWidth" },
          maw: { type: "spacing", property: "maxWidth" },
          h: { type: "spacing", property: "height" },
          mih: { type: "spacing", property: "minHeight" },
          mah: { type: "spacing", property: "maxHeight" },
          bgsz: { type: "size", property: "backgroundSize" },
          bgp: { type: "identity", property: "backgroundPosition" },
          bgr: { type: "identity", property: "backgroundRepeat" },
          bga: { type: "identity", property: "backgroundAttachment" },
          pos: { type: "identity", property: "position" },
          top: { type: "size", property: "top" },
          left: { type: "size", property: "left" },
          bottom: { type: "size", property: "bottom" },
          right: { type: "size", property: "right" },
          inset: { type: "size", property: "inset" },
          display: { type: "identity", property: "display" },
          flex: { type: "identity", property: "flex" },
        };
        var parse_style_props = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/style-props/parse-style-props/parse-style-props.mjs",
          ),
          use_random_classname = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/use-random-classname/use-random-classname.mjs",
          );
        const _Box = (0, react.forwardRef)(
          (
            {
              component,
              style,
              __vars,
              className,
              variant,
              mod,
              size,
              hiddenFrom,
              visibleFrom,
              lightHidden,
              darkHidden,
              renderRoot,
              __size,
              ...others
            },
            ref,
          ) => {
            const theme = (0, MantineThemeProvider.xd)(),
              Element = component || "div",
              { styleProps, rest } = (0, extract_style_props.j)(others),
              useSxTransform = (0, Mantine_context.NL)(),
              transformedSx = useSxTransform?.()?.(styleProps.sx),
              responsiveClassName = (0, use_random_classname.C)(),
              parsedStyleProps = (0, parse_style_props.X)({
                styleProps,
                theme,
                data: STYlE_PROPS_DATA,
              }),
              props = {
                ref,
                style: getBoxStyle({
                  theme,
                  style,
                  vars: __vars,
                  styleProps: parsedStyleProps.inlineStyles,
                }),
                className: (0, clsx.A)(className, transformedSx, {
                  [responsiveClassName]: parsedStyleProps.hasResponsiveStyles,
                  "mantine-light-hidden": lightHidden,
                  "mantine-dark-hidden": darkHidden,
                  [`mantine-hidden-from-${hiddenFrom}`]: hiddenFrom,
                  [`mantine-visible-from-${visibleFrom}`]: visibleFrom,
                }),
                "data-variant": variant,
                "data-size": (0, is_number_like.t)(size)
                  ? void 0
                  : size || void 0,
                size: __size,
                ...getBoxMod(mod),
                ...rest,
              };
            return (0, jsx_runtime.jsxs)(jsx_runtime.Fragment, {
              children: [
                parsedStyleProps.hasResponsiveStyles &&
                  (0, jsx_runtime.jsx)(InlineStyles.K, {
                    selector: `.${responsiveClassName}`,
                    styles: parsedStyleProps.styles,
                    media: parsedStyleProps.media,
                  }),
                "function" == typeof renderRoot
                  ? renderRoot(props)
                  : (0, jsx_runtime.jsx)(Element, { ...props }),
              ],
            });
          },
        );
        _Box.displayName = "@mantine/core/Box";
        const Box = _Box;
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/style-props/extract-style-props/extract-style-props.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          j: () => extractStyleProps,
        });
        var _utils_filter_props_filter_props_mjs__WEBPACK_IMPORTED_MODULE_2__ =
          __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/filter-props/filter-props.mjs",
          );
        __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        ),
          __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          );
        function extractStyleProps(others) {
          const {
            m,
            mx,
            my,
            mt,
            mb,
            ml,
            mr,
            me,
            ms,
            p,
            px,
            py,
            pt,
            pb,
            pl,
            pr,
            pe,
            ps,
            bd,
            bg,
            c,
            opacity,
            ff,
            fz,
            fw,
            lts,
            ta,
            lh,
            fs,
            tt,
            td,
            w,
            miw,
            maw,
            h,
            mih,
            mah,
            bgsz,
            bgp,
            bgr,
            bga,
            pos,
            top,
            left,
            bottom,
            right,
            inset,
            display,
            flex,
            hiddenFrom,
            visibleFrom,
            lightHidden,
            darkHidden,
            sx,
            ...rest
          } = others;
          return {
            styleProps: (0,
            _utils_filter_props_filter_props_mjs__WEBPACK_IMPORTED_MODULE_2__.J)(
              {
                m,
                mx,
                my,
                mt,
                mb,
                ml,
                mr,
                me,
                ms,
                p,
                px,
                py,
                pt,
                pb,
                pl,
                pr,
                pe,
                ps,
                bd,
                bg,
                c,
                opacity,
                ff,
                fz,
                fw,
                lts,
                ta,
                lh,
                fs,
                tt,
                td,
                w,
                miw,
                maw,
                h,
                mih,
                mah,
                bgsz,
                bgp,
                bgr,
                bga,
                pos,
                top,
                left,
                bottom,
                right,
                inset,
                display,
                flex,
                hiddenFrom,
                visibleFrom,
                lightHidden,
                darkHidden,
                sx,
              },
            ),
            rest,
          };
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/style-props/parse-style-props/parse-style-props.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          X: () => parseStyleProps,
        });
        var keys = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/keys/keys.mjs",
          ),
          rem =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/units-converters/rem.mjs",
            )),
          parse_theme_color = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/color-functions/parse-theme-color/parse-theme-color.mjs",
          );
        function colorResolver(color, theme) {
          const parsedColor = (0, parse_theme_color.g)({ color, theme });
          return "dimmed" === parsedColor.color
            ? "var(--mantine-color-dimmed)"
            : "bright" === parsedColor.color
              ? "var(--mantine-color-bright)"
              : parsedColor.variable
                ? `var(${parsedColor.variable})`
                : parsedColor.color;
        }
        const values = {
          text: "var(--mantine-font-family)",
          mono: "var(--mantine-font-family-monospace)",
          monospace: "var(--mantine-font-family-monospace)",
          heading: "var(--mantine-font-family-headings)",
          headings: "var(--mantine-font-family-headings)",
        };
        const headings = ["h1", "h2", "h3", "h4", "h5", "h6"];
        const line_height_resolver_headings = [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
        ];
        const resolvers = {
          color: colorResolver,
          textColor: function textColorResolver(color, theme) {
            const parsedColor = (0, parse_theme_color.g)({ color, theme });
            return parsedColor.isThemeColor && void 0 === parsedColor.shade
              ? `var(--mantine-color-${parsedColor.color}-text)`
              : colorResolver(color, theme);
          },
          fontSize: function fontSizeResolver(value, theme) {
            return "string" == typeof value && value in theme.fontSizes
              ? `var(--mantine-font-size-${value})`
              : "string" == typeof value && headings.includes(value)
                ? `var(--mantine-${value}-font-size)`
                : "number" == typeof value || "string" == typeof value
                  ? (0, rem.D)(value)
                  : value;
          },
          spacing: function spacingResolver(value, theme) {
            if ("number" == typeof value) return (0, rem.D)(value);
            if ("string" == typeof value) {
              const mod = value.replace("-", "");
              if (!(mod in theme.spacing)) return (0, rem.D)(value);
              const variable = `--mantine-spacing-${mod}`;
              return value.startsWith("-")
                ? `calc(var(${variable}) * -1)`
                : `var(${variable})`;
            }
            return value;
          },
          identity: function identityResolver(value) {
            return value;
          },
          size: function sizeResolver(value) {
            return "number" == typeof value ? (0, rem.D)(value) : value;
          },
          lineHeight: function lineHeightResolver(value, theme) {
            return "string" == typeof value && value in theme.lineHeights
              ? `var(--mantine-line-height-${value})`
              : "string" == typeof value &&
                  line_height_resolver_headings.includes(value)
                ? `var(--mantine-${value}-line-height)`
                : value;
          },
          fontFamily: function fontFamilyResolver(fontFamily) {
            return "string" == typeof fontFamily && fontFamily in values
              ? values[fontFamily]
              : fontFamily;
          },
          border: function borderResolver(value, theme) {
            if ("number" == typeof value) return (0, rem.D)(value);
            if ("string" == typeof value) {
              const [size, style, ...colorTuple] = value
                .split(" ")
                .filter((val) => "" !== val.trim());
              let result = `${(0, rem.D)(size)}`;
              return (
                style && (result += ` ${style}`),
                colorTuple.length > 0 &&
                  (result += ` ${colorResolver(colorTuple.join(" "), theme)}`),
                result.trim()
              );
            }
            return value;
          },
        };
        function replaceMediaQuery(query) {
          return query.replace("(min-width: ", "").replace("em)", "");
        }
        function getBreakpointValue(value, breakpoint) {
          return "object" == typeof value &&
            null !== value &&
            breakpoint in value
            ? value[breakpoint]
            : value;
        }
        function parseStyleProps({ styleProps, data, theme }) {
          return (function sortMediaQueries({ media, ...props }) {
            return {
              ...props,
              media: Object.keys(media)
                .sort(
                  (a, b) =>
                    Number(replaceMediaQuery(a)) - Number(replaceMediaQuery(b)),
                )
                .map((query) => ({ query, styles: media[query] })),
            };
          })(
            (0, keys.H)(styleProps).reduce(
              (acc, styleProp) => {
                if (
                  "hiddenFrom" === styleProp ||
                  "visibleFrom" === styleProp ||
                  "sx" === styleProp
                )
                  return acc;
                const propertyData = data[styleProp],
                  properties = Array.isArray(propertyData.property)
                    ? propertyData.property
                    : [propertyData.property],
                  baseValue = (function getBaseValue(value) {
                    return "object" == typeof value && null !== value
                      ? "base" in value
                        ? value.base
                        : void 0
                      : value;
                  })(styleProps[styleProp]);
                if (
                  !(function hasResponsiveStyles(styleProp) {
                    if ("object" != typeof styleProp || null === styleProp)
                      return !1;
                    const breakpoints = Object.keys(styleProp);
                    return (
                      1 !== breakpoints.length || "base" !== breakpoints[0]
                    );
                  })(styleProps[styleProp])
                )
                  return (
                    properties.forEach((property) => {
                      acc.inlineStyles[property] = resolvers[propertyData.type](
                        baseValue,
                        theme,
                      );
                    }),
                    acc
                  );
                acc.hasResponsiveStyles = !0;
                const breakpoints = (function getBreakpointKeys(value) {
                  return "object" == typeof value && null !== value
                    ? (0, keys.H)(value).filter((key) => "base" !== key)
                    : [];
                })(styleProps[styleProp]);
                return (
                  properties.forEach((property) => {
                    baseValue &&
                      (acc.styles[property] = resolvers[propertyData.type](
                        baseValue,
                        theme,
                      )),
                      breakpoints.forEach((breakpoint) => {
                        const bp = `(min-width: ${theme.breakpoints[breakpoint]})`;
                        acc.media[bp] = {
                          ...acc.media[bp],
                          [property]: resolvers[propertyData.type](
                            getBreakpointValue(
                              styleProps[styleProp],
                              breakpoint,
                            ),
                            theme,
                          ),
                        };
                      });
                  }),
                  acc
                );
              },
              {
                hasResponsiveStyles: !1,
                styles: {},
                inlineStyles: {},
                media: {},
              },
            ),
          );
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/Box/use-random-classname/use-random-classname.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          C: () => useRandomClassName,
        });
        var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        );
        function useRandomClassName() {
          return `__m__-${(0, react__WEBPACK_IMPORTED_MODULE_0__.useId)().replace(/:/g, "")}`;
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/InlineStyles/InlineStyles.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { K: () => InlineStyles });
        var jsx_runtime = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          ),
          Mantine_context =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs",
            )),
          keys = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/keys/keys.mjs",
          );
        function cssObjectToString(css) {
          return (0, keys.H)(css)
            .reduce(
              (acc, rule) =>
                void 0 !== css[rule]
                  ? `${acc}${(function camelToKebabCase(value) {
                      return value.replace(
                        /[A-Z]/g,
                        (letter) => `-${letter.toLowerCase()}`,
                      );
                    })(rule)}:${css[rule]};`
                  : acc,
              "",
            )
            .trim();
        }
        function stylesToString({ selector, styles, media, container }) {
          const baseStyles = styles ? cssObjectToString(styles) : "",
            mediaQueryStyles = Array.isArray(media)
              ? media.map(
                  (item) =>
                    `@media${item.query}{${selector}{${cssObjectToString(item.styles)}}}`,
                )
              : [],
            containerStyles = Array.isArray(container)
              ? container.map(
                  (item) =>
                    `@container ${item.query}{${selector}{${cssObjectToString(item.styles)}}}`,
                )
              : [];
          return `${baseStyles ? `${selector}{${baseStyles}}` : ""}${mediaQueryStyles.join("")}${containerStyles.join("")}`.trim();
        }
        function InlineStyles(props) {
          const nonce = (0, Mantine_context.WV)();
          return (0, jsx_runtime.jsx)("style", {
            "data-mantine-styles": "inline",
            nonce: nonce?.(),
            dangerouslySetInnerHTML: { __html: stylesToString(props) },
          });
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/use-props/use-props.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { Y: () => useProps });
        var _utils_filter_props_filter_props_mjs__WEBPACK_IMPORTED_MODULE_3__ =
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/filter-props/filter-props.mjs",
            ),
          _MantineThemeProvider_MantineThemeProvider_mjs__WEBPACK_IMPORTED_MODULE_2__ =
            (__webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
            ),
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
            ));
        function useProps(component, defaultProps, props) {
          const theme = (0,
            _MantineThemeProvider_MantineThemeProvider_mjs__WEBPACK_IMPORTED_MODULE_2__.xd)(),
            contextPropsPayload = theme.components[component]?.defaultProps;
          return {
            ...defaultProps,
            ...("function" == typeof contextPropsPayload
              ? contextPropsPayload(theme)
              : contextPropsPayload),
            ...(0,
            _utils_filter_props_filter_props_mjs__WEBPACK_IMPORTED_MODULE_3__.J)(
              props,
            ),
          };
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          D_: () => identity,
          P9: () => factory,
        });
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
            ),
          react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          );
        function identity(value) {
          return value;
        }
        function factory(ui) {
          const Component = (0, react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(
            ui,
          );
          return (
            (Component.extend = identity),
            (Component.withProps = (fixedProps) => {
              const Extended = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((props, ref) =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  Component,
                  { ...fixedProps, ...props, ref },
                ),
              );
              return (
                (Extended.extend = Component.extend),
                (Extended.displayName = `WithProps(${Component.displayName})`),
                Extended
              );
            }),
            Component
          );
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/polymorphic-factory.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          v: () => polymorphicFactory,
        });
        var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
            ),
          react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          _factory_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/factory/factory.mjs",
          );
        function polymorphicFactory(ui) {
          const Component = (0, react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)(
            ui,
          );
          return (
            (Component.withProps = (fixedProps) => {
              const Extended = (0,
              react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((props, ref) =>
                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(
                  Component,
                  { ...fixedProps, ...props, ref },
                ),
              );
              return (
                (Extended.extend = Component.extend),
                (Extended.displayName = `WithProps(${Component.displayName})`),
                Extended
              );
            }),
            (Component.extend = _factory_mjs__WEBPACK_IMPORTED_MODULE_2__.D_),
            Component
          );
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/create-vars-resolver/create-vars-resolver.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        function createVarsResolver(resolver) {
          return resolver;
        }
        __webpack_require__.d(__webpack_exports__, {
          V: () => createVarsResolver,
        });
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/get-class-name/resolve-class-names/resolve-class-names.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          J: () => resolveClassNames,
        });
        var clsx__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          "./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs",
        );
        const EMPTY_CLASS_NAMES = {};
        function resolveClassNames({ theme, classNames, props, stylesCtx }) {
          return (function mergeClassNames(objects) {
            const merged = {};
            return (
              objects.forEach((obj) => {
                Object.entries(obj).forEach(([key, value]) => {
                  merged[key]
                    ? (merged[key] = (0, clsx__WEBPACK_IMPORTED_MODULE_0__.A)(
                        merged[key],
                        value,
                      ))
                    : (merged[key] = value);
                });
              }),
              merged
            );
          })(
            (Array.isArray(classNames) ? classNames : [classNames]).map(
              (item) =>
                "function" == typeof item
                  ? item(theme, props, stylesCtx)
                  : item || EMPTY_CLASS_NAMES,
            ),
          );
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/get-style/resolve-styles/resolve-styles.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        function resolveStyles({ theme, styles, props, stylesCtx }) {
          return (Array.isArray(styles) ? styles : [styles]).reduce(
            (acc, style) =>
              "function" == typeof style
                ? { ...acc, ...style(theme, props, stylesCtx) }
                : { ...acc, ...style },
            {},
          );
        }
        __webpack_require__.d(__webpack_exports__, { N: () => resolveStyles });
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/use-styles.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { I: () => useStyles });
        __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        ),
          __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/jsx-runtime.js",
          );
        var Mantine_context = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/Mantine.context.mjs",
          ),
          MantineThemeProvider = __webpack_require__(
            "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/MantineProvider/MantineThemeProvider/MantineThemeProvider.mjs",
          ),
          clsx = __webpack_require__(
            "./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs",
          );
        const FOCUS_CLASS_NAMES = {
          always: "mantine-focus-always",
          auto: "mantine-focus-auto",
          never: "mantine-focus-never",
        };
        var resolve_class_names = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/get-class-name/resolve-class-names/resolve-class-names.mjs",
        );
        function getResolvedClassNames({
          selector,
          stylesCtx,
          theme,
          classNames,
          props,
        }) {
          return (0, resolve_class_names.J)({
            theme,
            classNames,
            props,
            stylesCtx,
          })[selector];
        }
        function getClassName({
          theme,
          options,
          themeName,
          selector,
          classNamesPrefix,
          classNames,
          classes,
          unstyled,
          className,
          rootSelector,
          props,
          stylesCtx,
          withStaticClasses,
          headless,
          transformedStyles,
        }) {
          return (0, clsx.A)(
            (function getGlobalClassNames({ theme, options, unstyled }) {
              return (0, clsx.A)(
                options?.focusable &&
                  !unstyled &&
                  (theme.focusClassName || FOCUS_CLASS_NAMES[theme.focusRing]),
                options?.active && !unstyled && theme.activeClassName,
              );
            })({ theme, options, unstyled: unstyled || headless }),
            (function getThemeClassNames({
              themeName,
              theme,
              selector,
              props,
              stylesCtx,
            }) {
              return themeName.map(
                (n) =>
                  (0, resolve_class_names.J)({
                    theme,
                    classNames: theme.components[n]?.classNames,
                    props,
                    stylesCtx,
                  })?.[selector],
              );
            })({ theme, themeName, selector, props, stylesCtx }),
            (function getVariantClassName({
              options,
              classes,
              selector,
              unstyled,
            }) {
              return options?.variant && !unstyled
                ? classes[`${selector}--${options.variant}`]
                : void 0;
            })({ options, classes, selector, unstyled }),
            getResolvedClassNames({
              selector,
              stylesCtx,
              theme,
              classNames,
              props,
            }),
            getResolvedClassNames({
              selector,
              stylesCtx,
              theme,
              classNames: transformedStyles,
              props,
            }),
            (function getOptionsClassNames({
              selector,
              stylesCtx,
              options,
              props,
              theme,
            }) {
              return (0, resolve_class_names.J)({
                theme,
                classNames: options?.classNames,
                props: options?.props || props,
                stylesCtx,
              })[selector];
            })({ selector, stylesCtx, options, props, theme }),
            (function getRootClassName({ rootSelector, selector, className }) {
              return rootSelector === selector ? className : void 0;
            })({ rootSelector, selector, className }),
            (function getSelectorClassName({ selector, classes, unstyled }) {
              return unstyled ? void 0 : classes[selector];
            })({ selector, classes, unstyled: unstyled || headless }),
            withStaticClasses &&
              !headless &&
              (function getStaticClassNames({
                themeName,
                classNamesPrefix,
                selector,
                withStaticClass,
              }) {
                return !1 === withStaticClass
                  ? []
                  : themeName.map(
                      (n) => `${classNamesPrefix}-${n}-${selector}`,
                    );
              })({
                themeName,
                classNamesPrefix,
                selector,
                withStaticClass: options?.withStaticClass,
              }),
            options?.className,
          );
        }
        var resolve_styles = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/styles-api/use-styles/get-style/resolve-styles/resolve-styles.mjs",
        );
        function getThemeStyles({
          theme,
          themeName,
          props,
          stylesCtx,
          selector,
        }) {
          return themeName
            .map(
              (n) =>
                (0, resolve_styles.N)({
                  theme,
                  styles: theme.components[n]?.styles,
                  props,
                  stylesCtx,
                })[selector],
            )
            .reduce((acc, val) => ({ ...acc, ...val }), {});
        }
        function resolveStyle({ style, theme }) {
          return Array.isArray(style)
            ? [...style].reduce(
                (acc, item) => ({
                  ...acc,
                  ...resolveStyle({ style: item, theme }),
                }),
                {},
              )
            : "function" == typeof style
              ? style(theme)
              : null == style
                ? {}
                : style;
        }
        var filter_props = __webpack_require__(
          "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/filter-props/filter-props.mjs",
        );
        function resolveVars({
          vars,
          varsResolver,
          theme,
          props,
          stylesCtx,
          selector,
          themeName,
          headless,
        }) {
          return (function mergeVars(vars) {
            return vars.reduce(
              (acc, current) => (
                current &&
                  Object.keys(current).forEach((key) => {
                    acc[key] = {
                      ...acc[key],
                      ...(0, filter_props.J)(current[key]),
                    };
                  }),
                acc
              ),
              {},
            );
          })([
            headless ? {} : varsResolver?.(theme, props, stylesCtx),
            ...themeName.map((name) =>
              theme.components?.[name]?.vars?.(theme, props, stylesCtx),
            ),
            vars?.(theme, props, stylesCtx),
          ])?.[selector];
        }
        function getStyle({
          theme,
          themeName,
          selector,
          options,
          props,
          stylesCtx,
          rootSelector,
          styles,
          style,
          vars,
          varsResolver,
          headless,
          withStylesTransform,
        }) {
          return {
            ...(!withStylesTransform &&
              getThemeStyles({ theme, themeName, props, stylesCtx, selector })),
            ...(!withStylesTransform &&
              (0, resolve_styles.N)({ theme, styles, props, stylesCtx })[
                selector
              ]),
            ...(!withStylesTransform &&
              (0, resolve_styles.N)({
                theme,
                styles: options?.styles,
                props: options?.props || props,
                stylesCtx,
              })[selector]),
            ...resolveVars({
              theme,
              props,
              stylesCtx,
              vars,
              varsResolver,
              selector,
              themeName,
              headless,
            }),
            ...(rootSelector === selector
              ? resolveStyle({ style, theme })
              : null),
            ...resolveStyle({ style: options?.style, theme }),
          };
        }
        function useStyles({
          name,
          classes,
          props,
          stylesCtx,
          className,
          style,
          rootSelector = "root",
          unstyled,
          classNames,
          styles,
          vars,
          varsResolver,
        }) {
          const theme = (0, MantineThemeProvider.xd)(),
            classNamesPrefix = (0, Mantine_context.AI)(),
            withStaticClasses = (0, Mantine_context.If)(),
            headless = (0, Mantine_context.FI)(),
            themeName = (Array.isArray(name) ? name : [name]).filter((n) => n),
            { withStylesTransform, getTransformedStyles } =
              (function useStylesTransform({ props, stylesCtx, themeName }) {
                const theme = (0, MantineThemeProvider.xd)(),
                  stylesTransform = (0, Mantine_context.m6)()?.();
                return {
                  getTransformedStyles: (styles) =>
                    stylesTransform
                      ? [
                          ...styles.map((style) =>
                            stylesTransform(style, {
                              props,
                              theme,
                              ctx: stylesCtx,
                            }),
                          ),
                          ...themeName.map((n) =>
                            stylesTransform(theme.components[n]?.styles, {
                              props,
                              theme,
                              ctx: stylesCtx,
                            }),
                          ),
                        ].filter(Boolean)
                      : [],
                  withStylesTransform: !!stylesTransform,
                };
              })({ props, stylesCtx, themeName });
          return (selector, options) => ({
            className: getClassName({
              theme,
              options,
              themeName,
              selector,
              classNamesPrefix,
              classNames,
              classes,
              unstyled,
              className,
              rootSelector,
              props,
              stylesCtx,
              withStaticClasses,
              headless,
              transformedStyles: getTransformedStyles([
                options?.styles,
                styles,
              ]),
            }),
            style: getStyle({
              theme,
              themeName,
              selector,
              options,
              props,
              stylesCtx,
              rootSelector,
              styles,
              style,
              vars,
              varsResolver,
              headless,
              withStylesTransform,
            }),
          });
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/filter-props/filter-props.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        function filterProps(props) {
          return Object.keys(props).reduce(
            (acc, key) => (
              void 0 !== props[key] && (acc[key] = props[key]), acc
            ),
            {},
          );
        }
        __webpack_require__.d(__webpack_exports__, { J: () => filterProps });
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/get-size/get-size.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          GY: () => getSpacing,
          YC: () => getSize,
          dh: () => getShadow,
          ks: () => getLineHeight,
          nJ: () => getRadius,
          ny: () => getFontSize,
        });
        var _is_number_like_is_number_like_mjs__WEBPACK_IMPORTED_MODULE_0__ =
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/is-number-like/is-number-like.mjs",
            ),
          _units_converters_rem_mjs__WEBPACK_IMPORTED_MODULE_1__ =
            __webpack_require__(
              "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/units-converters/rem.mjs",
            );
        function getSize(size, prefix = "size", convertToRem = !0) {
          if (void 0 !== size)
            return (0,
            _is_number_like_is_number_like_mjs__WEBPACK_IMPORTED_MODULE_0__.t)(
              size,
            )
              ? convertToRem
                ? (0, _units_converters_rem_mjs__WEBPACK_IMPORTED_MODULE_1__.D)(
                    size,
                  )
                : size
              : `var(--${prefix}-${size})`;
        }
        function getSpacing(size) {
          return getSize(size, "mantine-spacing");
        }
        function getRadius(size) {
          return void 0 === size
            ? "var(--mantine-radius-default)"
            : getSize(size, "mantine-radius");
        }
        function getFontSize(size) {
          return getSize(size, "mantine-font-size");
        }
        function getLineHeight(size) {
          return getSize(size, "mantine-line-height", !1);
        }
        function getShadow(size) {
          if (size) return getSize(size, "mantine-shadow", !1);
        }
      },
    "./node_modules/.pnpm/@mantine+core@7.17.4_@mantine+hooks@7.17.4_react@19.1.0__@types+react@19.1.1_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/@mantine/core/esm/core/utils/is-number-like/is-number-like.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        function isNumberLike(value) {
          if ("number" == typeof value) return !0;
          if ("string" == typeof value) {
            if (
              value.startsWith("calc(") ||
              value.startsWith("var(") ||
              (value.includes(" ") && "" !== value.trim())
            )
              return !0;
            const cssUnitsRegex =
              /^[+-]?[0-9]+(\.[0-9]+)?(px|em|rem|ex|ch|lh|rlh|vw|vh|vmin|vmax|vb|vi|svw|svh|lvw|lvh|dvw|dvh|cm|mm|in|pt|pc|q|cqw|cqh|cqi|cqb|cqmin|cqmax|%)?$/;
            return value
              .trim()
              .split(/\s+/)
              .every((val) => cssUnitsRegex.test(val));
          }
          return !1;
        }
        __webpack_require__.d(__webpack_exports__, { t: () => isNumberLike });
      },
    "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-did-update/use-did-update.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { C: () => useDidUpdate });
        var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        );
        function useDidUpdate(fn, dependencies) {
          const mounted = (0, react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);
          (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(
            () => () => {
              mounted.current = !1;
            },
            [],
          ),
            (0, react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
              if (mounted.current) return fn();
              mounted.current = !0;
            }, dependencies);
        }
      },
    "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-disclosure/use-disclosure.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { j: () => useDisclosure });
        var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        );
        function useDisclosure(initialState = !1, callbacks) {
          const { onOpen, onClose } = callbacks || {},
            [opened, setOpened] = (0,
            react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialState),
            open = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
              setOpened((isOpened) => isOpened || (onOpen?.(), !0));
            }, [onOpen]),
            close = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
              setOpened((isOpened) =>
                isOpened ? (onClose?.(), !1) : isOpened,
              );
            }, [onClose]),
            toggle = (0, react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(() => {
              opened ? close() : open();
            }, [close, open, opened]);
          return [opened, { open, close, toggle }];
        }
      },
    "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-id/use-id.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { B: () => useId });
        var react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          use_isomorphic_effect = __webpack_require__(
            "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-isomorphic-effect/use-isomorphic-effect.mjs",
          );
        const __useId = react["useId".toString()] || (() => {});
        function useId(staticId) {
          const reactId = (function useReactId() {
              const id = __useId();
              return id ? `mantine-${id.replace(/:/g, "")}` : "";
            })(),
            [uuid, setUuid] = (0, react.useState)(reactId);
          return (
            (0, use_isomorphic_effect.o)(() => {
              setUuid(
                (function randomId(prefix = "mantine-") {
                  return `${prefix}${Math.random().toString(36).slice(2, 11)}`;
                })(),
              );
            }, []),
            "string" == typeof staticId
              ? staticId
              : "undefined" == typeof window
                ? reactId
                : uuid
          );
        }
      },
    "./node_modules/.pnpm/@mantine+hooks@7.17.4_react@19.1.0/node_modules/@mantine/hooks/esm/use-input-state/use-input-state.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { D: () => useInputState });
        var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
          "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
        );
        function getInputOnChange(setValue) {
          return (val) => {
            if (val)
              if ("function" == typeof val) setValue(val);
              else if ("object" == typeof val && "nativeEvent" in val) {
                const { currentTarget } = val;
                "checkbox" === currentTarget.type
                  ? setValue(currentTarget.checked)
                  : setValue(currentTarget.value);
              } else setValue(val);
            else setValue(val);
          };
        }
        function useInputState(initialState) {
          const [value, setValue] = (0,
          react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialState);
          return [value, getInputOnChange(setValue)];
        }
      },
    "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, {
          A: () => createReactComponent,
        });
        var react = __webpack_require__(
            "./node_modules/.pnpm/next@15.3.0_@babel+core@7.26.10_@opentelemetry+api@1.9.0_react-dom@19.1.0_react@19.1.0__react@19.1.0/node_modules/next/dist/compiled/react/index.js",
          ),
          defaultAttributes = {
            outline: {
              xmlns: "http://www.w3.org/2000/svg",
              width: 24,
              height: 24,
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: 2,
              strokeLinecap: "round",
              strokeLinejoin: "round",
            },
            filled: {
              xmlns: "http://www.w3.org/2000/svg",
              width: 24,
              height: 24,
              viewBox: "0 0 24 24",
              fill: "currentColor",
              stroke: "none",
            },
          };
        const createReactComponent = (
          type,
          iconName,
          iconNamePascal,
          iconNode,
        ) => {
          const Component = (0, react.forwardRef)(
            (
              {
                color = "currentColor",
                size = 24,
                stroke = 2,
                title,
                className,
                children,
                ...rest
              },
              ref,
            ) =>
              (0, react.createElement)(
                "svg",
                {
                  ref,
                  ...defaultAttributes[type],
                  width: size,
                  height: size,
                  className: [
                    "tabler-icon",
                    `tabler-icon-${iconName}`,
                    className,
                  ].join(" "),
                  ...("filled" === type
                    ? { fill: color }
                    : { strokeWidth: stroke, stroke: color }),
                  ...rest,
                },
                [
                  title &&
                    (0, react.createElement)(
                      "title",
                      { key: "svg-title" },
                      title,
                    ),
                  ...iconNode.map(([tag, attrs]) =>
                    (0, react.createElement)(tag, attrs),
                  ),
                  ...(Array.isArray(children) ? children : [children]),
                ],
              ),
          );
          return (Component.displayName = `${iconNamePascal}`), Component;
        };
      },
    "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/icons/IconPlus.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { A: () => IconPlus });
        var IconPlus = (0,
        __webpack_require__(
          "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs",
        ).A)("outline", "plus", "IconPlus", [
          ["path", { d: "M12 5l0 14", key: "svg-0" }],
          ["path", { d: "M5 12l14 0", key: "svg-1" }],
        ]);
      },
    "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/icons/IconX.mjs":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { A: () => IconX });
        var IconX = (0,
        __webpack_require__(
          "./node_modules/.pnpm/@tabler+icons-react@3.31.0_react@19.1.0/node_modules/@tabler/icons-react/dist/esm/createReactComponent.mjs",
        ).A)("outline", "x", "IconX", [
          ["path", { d: "M18 6l-12 12", key: "svg-0" }],
          ["path", { d: "M6 6l12 12", key: "svg-1" }],
        ]);
      },
    "./node_modules/.pnpm/clsx@2.1.1/node_modules/clsx/dist/clsx.mjs": (
      __unused_webpack_module,
      __webpack_exports__,
      __webpack_require__,
    ) => {
      function r(e) {
        var t,
          f,
          n = "";
        if ("string" == typeof e || "number" == typeof e) n += e;
        else if ("object" == typeof e)
          if (Array.isArray(e)) {
            var o = e.length;
            for (t = 0; t < o; t++)
              e[t] && (f = r(e[t])) && (n && (n += " "), (n += f));
          } else for (f in e) e[f] && (n && (n += " "), (n += f));
        return n;
      }
      __webpack_require__.d(__webpack_exports__, {
        A: () => __WEBPACK_DEFAULT_EXPORT__,
      });
      const __WEBPACK_DEFAULT_EXPORT__ = function clsx() {
        for (var e, t, f = 0, n = "", o = arguments.length; f < o; f++)
          (e = arguments[f]) && (t = r(e)) && (n && (n += " "), (n += t));
        return n;
      };
    },
    "./node_modules/.pnpm/uuid@11.1.0/node_modules/uuid/dist/esm-browser/v4.js":
      (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
        __webpack_require__.d(__webpack_exports__, { A: () => esm_browser_v4 });
        const esm_browser_native = {
          randomUUID:
            "undefined" != typeof crypto &&
            crypto.randomUUID &&
            crypto.randomUUID.bind(crypto),
        };
        let getRandomValues;
        const rnds8 = new Uint8Array(16);
        const byteToHex = [];
        for (let i = 0; i < 256; ++i)
          byteToHex.push((i + 256).toString(16).slice(1));
        function unsafeStringify(arr, offset = 0) {
          return (
            byteToHex[arr[offset + 0]] +
            byteToHex[arr[offset + 1]] +
            byteToHex[arr[offset + 2]] +
            byteToHex[arr[offset + 3]] +
            "-" +
            byteToHex[arr[offset + 4]] +
            byteToHex[arr[offset + 5]] +
            "-" +
            byteToHex[arr[offset + 6]] +
            byteToHex[arr[offset + 7]] +
            "-" +
            byteToHex[arr[offset + 8]] +
            byteToHex[arr[offset + 9]] +
            "-" +
            byteToHex[arr[offset + 10]] +
            byteToHex[arr[offset + 11]] +
            byteToHex[arr[offset + 12]] +
            byteToHex[arr[offset + 13]] +
            byteToHex[arr[offset + 14]] +
            byteToHex[arr[offset + 15]]
          ).toLowerCase();
        }
        const esm_browser_v4 = function v4(options, buf, offset) {
          if (esm_browser_native.randomUUID && !buf && !options)
            return esm_browser_native.randomUUID();
          const rnds =
            (options = options || {}).random ??
            options.rng?.() ??
            (function rng() {
              if (!getRandomValues) {
                if ("undefined" == typeof crypto || !crypto.getRandomValues)
                  throw new Error(
                    "crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported",
                  );
                getRandomValues = crypto.getRandomValues.bind(crypto);
              }
              return getRandomValues(rnds8);
            })();
          if (rnds.length < 16)
            throw new Error("Random bytes length must be >= 16");
          if (
            ((rnds[6] = (15 & rnds[6]) | 64),
            (rnds[8] = (63 & rnds[8]) | 128),
            buf)
          ) {
            if ((offset = offset || 0) < 0 || offset + 16 > buf.length)
              throw new RangeError(
                `UUID byte range ${offset}:${offset + 15} is out of buffer bounds`,
              );
            for (let i = 0; i < 16; ++i) buf[offset + i] = rnds[i];
            return buf;
          }
          return unsafeStringify(rnds);
        };
      },
  },
]);
