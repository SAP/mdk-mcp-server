export default function ShowBannerStyles(context) {
    const pageProxy = context.getPageProxy();
    const cd = pageProxy.getClientData();
    alert(`Banner styles:\n${cd.Semantic != null ? `Semantic: ${cd.Semantic}\n` : ""}${cd.CompletionSemantic != null ? `CompletionSemantic: ${cd.CompletionSemantic}\n` : ""}${cd.Styles != null ? `Styles: ${JSON.stringify(cd.Styles)}` : ""}`);
  }