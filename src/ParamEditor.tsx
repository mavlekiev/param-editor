import React from "react";

interface Param {
  id: number;
  name: string;
  type: "string";
}

interface ParamValue {
  paramId: number;
  value: string;
}

interface Color {
  id: number;
  name: string;
}

interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Props {
  params: Param[];
  model: Model;
}

type ParamState = Record<number, string>;

interface State {
  paramValues: ParamState;
}

// eslint-disable-next-line react-refresh/only-export-components
const ParamInput: React.FC<{
  param: Param;
  value: string;
  onChange: (value: string) => void;
}> = ({ param, value, onChange }) => (
  <div className="param-row">
    <label className="param-label">{param.name}</label>
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="param-input"
      aria-label={param.name}
    />
  </div>
);

export class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const initialParamValues: ParamState = {};
    props.model.paramValues.forEach((pv) => {
      initialParamValues[pv.paramId] = pv.value;
    });
    props.params.forEach((p) => {
      if (!(p.id in initialParamValues)) {
        initialParamValues[p.id] = "";
      }
    });

    this.state = {
      paramValues: initialParamValues,
    };
  }

  handleParamChange = (paramId: number, newValue: string) => {
    this.setState((prevState) => ({
      paramValues: {
        ...prevState.paramValues,
        [paramId]: newValue,
      },
    }));
  };

  getModel(): Model {
    const { colors } = this.props.model;
    const paramValues: ParamValue[] = Object.entries(
      this.state.paramValues,
    ).map(([paramIdStr, value]) => ({
      paramId: Number(paramIdStr),
      value,
    }));

    return {
      paramValues,
      colors,
    };
  }

  render() {
    const { params } = this.props;
    const { paramValues } = this.state;

    return (
      <div className="param-editor">
        <h3>Редактор параметров</h3>
        <div className="params-list">
          {params.map((param) => {
            const currentValue = paramValues[param.id] ?? "";
            return (
              <ParamInput
                key={param.id}
                param={param}
                value={currentValue}
                onChange={(v) => this.handleParamChange(param.id, v)}
              />
            );
          })}
        </div>
      </div>
    );
  }
}

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = `
    .param-editor {
      font-family: sans-serif;
      max-width: 600px;
    }
    .params-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .param-row {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .param-label {
      flex: 0 0 120px;
      font-weight: bold;
    }
    .param-input {
      flex: 1;
      padding: 6px 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}
