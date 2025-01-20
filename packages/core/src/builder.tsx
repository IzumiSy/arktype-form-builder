import { JsonSchema, type Type } from "arktype";
import { type ReactNode } from "react";
import { useForm, UseFormRegisterReturn, UseFormReturn } from "react-hook-form";
import { arktypeResolver } from "@hookform/resolvers/arktype";

declare global {
  interface ArkEnv {
    meta(): {
      label?: string;
      index?: number;
      component?: {
        type?: string;
      };
    };
  }
}

type ChildrenFieldProps<T extends Record<string, unknown>> = {
  name: keyof T;
  label?: string;
  render?: (props: {
    field: UseFormRegisterReturn;
    meta: ArkEnv.meta;
  }) => ReactNode;
};

type RenderFormChildrenProps<T extends Record<string, unknown>> = (props: {
  Field: (props: ChildrenFieldProps<T>) => ReactNode;
  Submit: () => ReactNode;
  form: UseFormReturn<T>;
}) => ReactNode;

type RenderFormProps<T extends Type<Record<string, unknown>, {}>> = {
  value: T;
  onSubmit?: (data: T["infer"]) => void;
  children?: RenderFormChildrenProps<T["infer"]>;
};

export const useFormBuilder = <T extends Type<Record<string, unknown>, {}>>(
  props: RenderFormProps<T>
) => {
  const form = useForm({
    resolver: arktypeResolver(props.value),
  });

  const submit = form.handleSubmit((data) => {
    if (props.onSubmit) {
      props.onSubmit(data);
    }
  });

  const getFieldRenderer = (fieldProps: {
    schema: JsonSchema.Object;
    fieldKey: string;
    label?: string;
  }) => {
    const { schema, fieldKey, label } = fieldProps;
    const isRequired = schema.required?.includes(fieldKey);
    const fieldMeta = props.value.get(fieldKey).meta;
    const registerer = form.register(fieldKey);

    return {
      meta: fieldMeta,
      registerer,
      render: () => {
        return (
          <div key={fieldKey}>
            <label>
              {label ?? fieldMeta.label ?? fieldKey}{" "}
              {isRequired ? "(Required)" : null}
            </label>
            <input {...registerer} type="text" />
          </div>
        );
      },
    };
  };

  const renderField = (fieldProps: ChildrenFieldProps<T["infer"]>) => {
    const jsonSchema = props.value.toJsonSchema();
    if (!("properties" in jsonSchema) || !jsonSchema.properties) {
      return null;
    }

    const fieldKey = fieldProps.name as string;
    const fieldRenderer = getFieldRenderer({
      fieldKey,
      schema: jsonSchema,
      label: fieldProps.label,
    });
    if (fieldProps.render) {
      return fieldProps.render({
        field: fieldRenderer.registerer,
        meta: fieldRenderer.meta,
      });
    }
    return fieldRenderer.render();
  };
  const renderSubmit = () => {
    return <button onClick={submit}>Submit</button>;
  };

  return {
    form,
    Field: renderField,
    Submit: renderSubmit,
    Autoform: () => {
      const jsonSchema = props.value.toJsonSchema();
      if (!("properties" in jsonSchema) || !jsonSchema.properties) {
        return null;
      }

      const fieldKeys = Object.keys(jsonSchema.properties).sort((a, b) => {
        const fieldA = props.value.get(a).meta.index ?? 0;
        const fieldB = props.value.get(b).meta.index ?? 0;
        return fieldA - fieldB;
      });

      return (
        <>
          {fieldKeys.map((fieldKey) => renderField({ name: fieldKey }))}
          {renderSubmit()}
        </>
      );
    },
  };
};

export const FormBuilder = <T extends Type<Record<string, unknown>, {}>>(
  props: RenderFormProps<T>
): ReactNode => {
  const formBuilder = useFormBuilder(props);
  const jsonSchema = props.value.toJsonSchema();
  if (!("properties" in jsonSchema) || !jsonSchema.properties) {
    return null;
  }

  if (props.children) {
    return props.children({
      form: formBuilder.form,
      Field: formBuilder.Field,
      Submit: formBuilder.Submit,
    });
  }

  return <formBuilder.Autoform />;
};
