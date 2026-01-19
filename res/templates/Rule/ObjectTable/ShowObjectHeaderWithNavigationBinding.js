export default function ShowObjectHeaderWithNavigationBinding(controlProxy) {
  // Pass a custom object as the navigation binding to the next page.
  const navigationBinding = {
    BodyText: "1000-Hamburg, MECHANIK.  This is a body label, which its text can not be wrapped",
    Description: "Temperature sensor predicts overheating failure in 4 days Urgent and needs attentions.  Temperature sensor predicts overheating failure in 4 days Urgent and needs attentions.",
    DetailImage: "/MDKDevApp/Images/seam.png",
    DetailImageIsCircular: false,
    Footnote: "Due on 12/31/16.  This is a footnote label, which its text can not be wrapped",
    HeadlineText: "Inspect Electric Pump Motor Long Job Title Example Will Wrap Max# of Lines in the HeadlineLabel",
    Subhead: 'The Subhead value',
    Tags: [
      "Tag1",
      "Tag2",
      "Tag3",
      "Tag4"
    ],
  };
  const pageProxy = controlProxy.getPageProxy();
  pageProxy.setActionBinding(navigationBinding);
  return pageProxy.executeAction('/MDKDevApp/Actions/Navigation/NavToDynamicObjectHeader.action');
}
