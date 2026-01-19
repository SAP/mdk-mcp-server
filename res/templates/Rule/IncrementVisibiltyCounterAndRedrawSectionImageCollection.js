import VisbilityCounterIncrement from "./VisibilityCounterIncrement";

export default function IncrementVisibiltyCounterAndRedrawSectionImageCollection(clientAPI) {
  VisbilityCounterIncrement(clientAPI);
  var ruleSectionObs = clientAPI.getSections()[0]._context.element._observable;
  ruleSectionObs.redraw();
  
  ruleSectionObs = clientAPI.getSections()[1]._context.element._observable;
  ruleSectionObs.redraw();
}