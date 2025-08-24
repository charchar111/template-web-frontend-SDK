import React from "react";
import { PrintControl } from "./service/model/PrintControl";

const printControl = new PrintControl();

export default function Test() {
  printControl;
  // printControl.toPrint("#printArea");
  return <div>test</div>;
}
