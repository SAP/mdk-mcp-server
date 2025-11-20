export default function ToggleBannerMessageStyles(context) {
    let value = context.getValue();
    let cd = context.getPageProxy().getClientData();
    if (!cd.Styles) {
        cd.Styles = {}
    }
    if (value) {
        switch (context.getName()) {
            case "Banner":
                cd.Styles["Banner"] = "banner-custom-1";
                break;
            case "MessageText":
                cd.Styles["MessageText"] = "banner-message-custom-1";
                break;
            case "ActionLabel":
                cd.Styles["ActionLabel"] = "banner-action-custom-1";
                break
            case "DismissButton":
                cd.Styles["DismissButton"] = "banner-dismiss-custom-1";
                break;
            default:
                break;
        }
    } else {
        switch (context.getName()) {
            case "Banner":
                cd.Styles["Banner"] = "";
                break;
            case "MessageText":
                cd.Styles["MessageText"] = "";
                break;
            case "ActionLabel":
                cd.Styles["ActionLabel"] = "";
                break
            case "DismissButton":
                cd.Styles["DismissButton"] = "";
                break;
            default:
                break;
        }
    }
}
