// ServerRenderer.js

import React from "react";
import {
  createServerTree,
} from "./ServerRenderUtils.js";

const emptyApi = {};

export default function ServerRenderer({
  tree,
  api=emptyApi,
}) {
  return createServerTree(
    tree,
    api
  );
}