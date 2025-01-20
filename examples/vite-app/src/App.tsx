import { type as arktype } from "arktype";
import { FormBuilder } from "@arktype-form-builder/core";

const user = arktype({
  name: "string",
  age: "number",
});

const App = () => {
  return <FormBuilder value={user} />;
};

export default App;
