import { render, screen, fireEvent } from "@testing-library/react";
import React from "react";
import { ParamEditor } from "./ParamEditor";
import { describe, it, expect } from "vitest";

// Создаём обёртку, чтобы получить ref на экземпляр ParamEditor
// eslint-disable-next-line react/display-name
const ParamEditorWithRef = React.forwardRef<
  InstanceType<typeof ParamEditor>,
  React.ComponentProps<typeof ParamEditor>
>((props, ref) => <ParamEditor {...props} ref={ref} />);

describe("ParamEditor", () => {
  const params = [
    { id: 1, name: "Назначение", type: "string" as const },
    { id: 2, name: "Длина", type: "string" as const },
  ];

  const model = {
    paramValues: [
      { paramId: 1, value: "повседневное" },
      { paramId: 2, value: "макси" },
    ],
    colors: [{ id: 1, name: "Черный" }],
  };

  it("отображает все параметры из params", () => {
    render(<ParamEditor params={params} model={model} />);
    expect(screen.getByLabelText("Назначение")).toBeInTheDocument();
    expect(screen.getByLabelText("Длина")).toBeInTheDocument();
  });

  it("инициализирует поля из model.paramValues", () => {
    render(<ParamEditor params={params} model={model} />);
    expect(screen.getByDisplayValue("повседневное")).toBeInTheDocument();
    expect(screen.getByDisplayValue("макси")).toBeInTheDocument();
  });

  it("позволяет изменять значения и getModel() возвращает обновлённую модель", () => {
    const ref = React.createRef<InstanceType<typeof ParamEditor>>();
    render(<ParamEditorWithRef params={params} model={model} ref={ref} />);

    const input1 = screen.getByDisplayValue("повседневное");
    const input2 = screen.getByDisplayValue("макси");

    fireEvent.change(input1, { target: { value: "спортивное" } });
    fireEvent.change(input2, { target: { value: "мини" } });

    // Теперь ref.current — это экземпляр ParamEditor
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const modelResult = ref.current!.getModel();

    expect(modelResult.paramValues).toEqual([
      { paramId: 1, value: "спортивное" },
      { paramId: 2, value: "мини" },
    ]);
    expect(modelResult.colors).toEqual([{ id: 1, name: "Черный" }]);
  });

  it("добавляет отсутствующие параметры как пустые строки", () => {
    const partialModel = {
      paramValues: [{ paramId: 1, value: "значение" }],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      colors: [] as any[],
    };
    render(<ParamEditor params={params} model={partialModel} />);
    expect(screen.getByDisplayValue("значение")).toBeInTheDocument();
    expect(screen.getByDisplayValue("")).toBeInTheDocument();
  });
});
