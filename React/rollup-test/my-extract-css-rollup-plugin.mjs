const extractArr = [];

export default function myExtractCssRollupPlugin(opts) {
  return {
    name: "my-extract-css-rollup-plugin",
    //code为文件内容， id为绝对路径
    transform(code, id) {
      console.log(code, "AAA", id);

      if (!id.endsWith(".css")) {
        return null;
      }

      extractArr.push(code);

      return {
        code: "export default '老天爷'",
        map: { mappings: "" },
      };
    },
    generateBundle(options, bundle) {
      this.emitFile({
        fileName: opts.filename || "guang.css",
        type: "asset",
        source: extractArr.join("\n/*光光666*/\n"),
      });
    },
  };
}
