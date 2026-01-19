export default function ToggleEditFormCells(context) {
    let bEnabled = context.getValue();
    let container = context.getPageProxy().getControl("SectionedTable0");

    let titleFormCell = container.getControl("FormCellTitle1");
    let noteFormCell = container.getControl('NoteFormCell');

    if (bEnabled) {
        titleFormCell.setEditable(true);
        noteFormCell.setEditable(true);
    }
    else {
        titleFormCell.setEditable(false);
        noteFormCell.setEditable(false);
    }
}
