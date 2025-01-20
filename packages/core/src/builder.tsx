import { type Type } from "arktype";
import { type ReactNode } from "react";

declare global {
  interface ArkEnv {
    meta(): {
      label?: string;
      component?: {
        type?: string;
      };
    };
  }
}

type RenderFormChildrenProps<T extends Record<string, unknown>> = (props: {
  Field: (props: { name: keyof T }) => ReactNode;
}) => ReactNode;

type RenderFormProps<T extends Type<Record<string, unknown>, {}>> = {
  value: T;
  children?: RenderFormChildrenProps<T["infer"]>;
};

export const FormBuilder = <T extends Type<Record<string, unknown>, {}>>(
  props: RenderFormProps<T>
) => {
  const jsonSchema = props.value.toJsonSchema();
  if (!("properties" in jsonSchema)) {
    return;
  }

  const renderField = (fieldKey: string) => {
    const key = fieldKey as string;
    const isRequired = jsonSchema.required?.includes(key);
    const field = props.value.get(fieldKey).meta;

    return (
      <div key={key}>
        <label>
          {field.label ?? key} {isRequired ? "(Required)" : null}
        </label>
        <input type="text" />
      </div>
    );
  };

  if (props.children) {
    return props.children({
      Field: (props) => renderField(props.name as string),
    });
  }

  if (!jsonSchema.properties) {
    return null;
  }

  return (
    <>
      {Object.keys(jsonSchema.properties).map((key) => {
        return renderField(key);
      })}
    </>
  );
};
