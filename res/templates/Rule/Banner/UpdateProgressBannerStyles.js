export default function UpdateProgressBannerStyles(context) {
    const value = context.getValue();
    const cd = context.getPageProxy().getClientData();
    const name = context.getName();
    if (!cd.Styles) {
        cd.Styles = {
            "Banner": {},
            "MessageText": {},
            "ActionLabel": {},
            "DismissButton": {}
        };
    }
    let selected = "";
    if (value && value.length) {
        selected = value[0].ReturnValue;
        switch (selected) {
        case "Progress":
            switch (name) {
            case "CustomBannerSegmented":
                cd.Styles["Banner"]["Progress"] = "banner-custom-1";
                cd.Styles["Banner"]["Completion"] = undefined;
                break;
            case "CustomMessageTextSegmented":
                cd.Styles["MessageText"]["Progress"] = "banner-message-custom-1";
                cd.Styles["MessageText"]["Completion"] = undefined;
                break;
            case "CustomActionLabelSegmented":
                cd.Styles["ActionLabel"]["Progress"] = "banner-action-custom-1";
                cd.Styles["ActionLabel"]["Completion"] = undefined;
                break;
            case "CustomDismissButtonSegmented":
                cd.Styles["DismissButton"]["Progress"] = "banner-dismiss-custom-1";
                cd.Styles["DismissButton"]["Completion"] = undefined;
                break;
            default:
                break;
            }
            break;
        case "Completion":
            switch (name) {
            case "CustomBannerSegmented":
                cd.Styles["Banner"]["Completion"] = "banner-custom-2";
                cd.Styles["Banner"]["Progress"] = undefined;
                break;
            case "CustomMessageTextSegmented":
                cd.Styles["MessageText"]["Completion"] = "banner-message-custom-2";
                cd.Styles["MessageText"]["Progress"] = undefined;
                break;
            case "CustomActionLabelSegmented":
                cd.Styles["ActionLabel"]["Completion"] = "banner-action-custom-2";
                cd.Styles["ActionLabel"]["Progress"] = undefined;
                break;
            case "CustomDismissButtonSegmented":
                cd.Styles["DismissButton"]["Completion"] = "banner-dismiss-custom-2";
                cd.Styles["DismissButton"]["Progress"] = undefined;
                break;
            default:
                break;
            }
            break;
        case "Both":
            switch (name) {
            case "CustomBannerSegmented":
                cd.Styles.Banner["Progress"] = "banner-custom-1";
                cd.Styles.Banner["Completion"] = "banner-custom-2";
                break;
            case "CustomMessageTextSegmented":
                cd.Styles.MessageText["Progress"] = "banner-message-custom-1";
                cd.Styles.MessageText["Completion"] = "banner-message-custom-2";
                break;
            case "CustomActionLabelSegmented":
                cd.Styles.ActionLabel["Progress"] = "banner-action-custom-1";
                cd.Styles.ActionLabel["Completion"] = "banner-action-custom-2";
                break;
            case "CustomDismissButtonSegmented":
                cd.Styles.DismissButton["Progress"] = "banner-dismiss-custom-1";
                cd.Styles.DismissButton["Completion"] = "banner-dismiss-custom-2";
                break;
            default:
                break;
            }
            break;
        default:
            break;
        }        
    }
    else {
        switch (name) {
        case "CustomBannerSegmented":
            cd.Styles.Banner["Progress"] = undefined;
            cd.Styles.Banner["Completion"] = undefined;
            break;
        case "CustomMessageTextSegmented":
            cd.Styles.MessageText["Progress"] = undefined;
            cd.Styles.MessageText["Completion"] = undefined;
            break;
        case "CustomActionLabelSegmented":
            cd.Styles.ActionLabel["Progress"] = undefined;
            cd.Styles.ActionLabel["Completion"] = undefined;
            break;
        case "CustomDismissButtonSegmented":
            cd.Styles.DismissButton["Progress"] = undefined;
            cd.Styles.DismissButton["Completion"] = undefined;
            break;
        default:
            break;
        }
    }
}
