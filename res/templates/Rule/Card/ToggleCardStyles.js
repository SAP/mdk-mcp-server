export default function ToggleCardStyles(context) {
    const value = context.getValue();
    const cd = context.getPageProxy().getClientData();
    const name = context.getName();
    switch (name) {
        case "Card":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardStyles = {
                        "Card": "card-background-1"
                    };
                } else {
                    cd.CardStyles = {
                        "Card": "card-background-2"
                    };
                }
            } else {
                cd.CardStyles = {};
            }
            break;
        case "Media":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardMediaStyles = {
                        "Image": "card-media-image-1",
                        "Media": "card-background-1"
                    };
                } else {
                    cd.CardMediaStyles = {
                        "Image": "card-media-image-2",
                        "Media": "card-background-2"
                    };
                }
            } else {
                cd.CardMediaStyles = {};
            }
            break;
        case "Header":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardHeaderStyles = {
                        "Title": "card-title-1",
                        "Subtitle": "card-subtitle-1",
                        "CounterText": "card-counter-text-1",
                        "DetailImage": "card-media-image-1",
                        "Icons": "card-font-icon-1",
                        "Header": "card-background-1"
                    };
                } else {
                    cd.CardHeaderStyles = {
                        "Title": "card-title-2",
                        "Subtitle": "card-subtitle-2",
                        "CounterText": "card-counter-text-2",
                        "DetailImage": "card-media-image-2",
                        "Icons": "card-font-icon-2",
                        "Header": "card-background-2"
                    };
                }
            } else {
                cd.CardHeaderStyles = {};
            }
            break;
        case "OverflowItem":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardOverflowItemStyles = {
                        "Image": "card-font-icon-1",
                        "Title": "card-label-1"
                    };
                } else {
                    cd.CardOverflowItemStyles = {
                        "Image": "card-font-icon-2",
                        "Title": "card-label-2"
                    };
                }
            } else {
                cd.CardOverflowItemStyles = {};
            }
            break;
        case "HeaderAction":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.HeaderActionStyles = {
                        "Image": "card-font-icon-1"
                    };
                } else {
                    cd.HeaderActionStyles = {
                        "Image": "card-font-icon-2"
                    };
                }
            } else {
                cd.HeaderActionStyles = {};
            }
            break;
        case "HeaderKpiView":
            cd.CardHeaderKpiViewStyles = {};
            break;
        case "ExtendedHeaderTag":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardExtendedHeaderTagStyles = "card-tag-1";
                } else {
                    cd.CardExtendedHeaderTagStyles = "card-tag-2";
                }
            } else {
                cd.CardExtendedHeaderTagStyles = "";
            }
            break;
        case "ExtendedHeaderLabel":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardExtendedHeaderLabelStyles = {
                        "Image": "card-font-icon-1",
                        "Text": "card-label-1"
                    };
                } else {
                    cd.CardExtendedHeaderLabelStyles = {
                        "Image": "card-font-icon-2",
                        "Text": "card-label-2"
                    };
                }
            } else {
                cd.CardExtendedHeaderLabelStyles = "";
            }
            break;
        case "ExtendedHeaderRating":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardExtendedHeaderRatingStyles = {
                        "IconOn": "card-font-icon-1",
                        "IconOff": "card-font-icon-2",
                        "Label": "card-label-1"
                    };
                } else {
                    cd.CardExtendedHeaderRatingStyles = {
                        "IconOn": "card-font-icon-2",
                        "IconOff": "card-font-icon-1",
                        "Label": "card-label-2"
                    };
                }
            } else {
                cd.CardExtendedHeaderRatingStyles = {};
            }
            break;
        case "ExtendedHeaderKpiView":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardExtendedHeaderKpiViewStyles = {
                        "LeftMetric": "card-kpi-view-metric-1",
                        "LeftUnit": "card-kpi-view-unit-1",
                        "RightMetric": "card-kpi-view-metric-1",
                        "RightUnit": "card-kpi-view-unit-1",
                        "Footnote": "card-label-1"
                    };
                } else {
                    cd.CardExtendedHeaderKpiViewStyles = {
                        "LeftMetric": "card-kpi-view-metric-2",
                        "LeftUnit": "card-kpi-view-unit-2",
                        "RightMetric": "card-kpi-view-metric-2",
                        "RightUnit": "card-kpi-view-unit-2",
                        "Footnote": "card-label-2"
                    };
                }
            } else {
                cd.CardExtendedHeaderKpiViewStyles = {};
            }
            break;
        case "BodySeparators":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardBodySeparatorsStyles = {
                        "HeaderSeparator": "card-counter-text-1",
                        "BodySeparator": "card-label-1",
                        "FooterSeparator": "card-counter-text-1"
                    };
                } else {
                    cd.CardBodySeparatorsStyles = {
                        "HeaderSeparator": "card-counter-text-2",
                        "BodySeparator": "card-label-2",
                        "FooterSeparator": "card-counter-text-2"
                    };
                }
            } else {
                cd.CardBodySeparatorsStyles = {};
            }
            break;
        case "BodyContentText":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardBodyContentTextStyles = {
                        "Text": "card-label-1"
                    };
                } else {
                    cd.CardBodyContentTextStyles = {
                        "Text": "card-label-2"
                    };
                }
            } else {
                cd.CardBodyContentTextStyles = {};
            }
            break;
        case "BodyContentLabelBarItem1":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardBodyContentLabelBarItem1Styles = {
                        "Image": "card-font-icon-1",
                        "Text": "card-label-1"
                    };
                } else {
                    cd.CardBodyContentLabelBarItem1Styles = {
                        "Image": "card-font-icon-2",
                        "Text": "card-label-2"
                    };
                }
            } else {
                cd.CardBodyContentLabelBarItem1Styles = {};
            }
            break;
        case "BodyContentLabelBarItem2":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardBodyContentLabelBarItem2Styles = {
                        "Text": "card-counter-text-1"
                    };
                } else {
                    cd.CardBodyContentLabelBarItem2Styles = {
                        "Text": "card-counter-text-2"
                    };
                }
            } else {
                cd.CardBodyContentLabelBarItem2Styles = {};
            }
            break;
        case "BodyContentSeparator":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardBodyContentSeparatorStyles = "card-label-1"
                } else {
                    cd.CardBodyContentSeparatorStyles = "card-label-2"
                }
            } else {
                cd.CardBodyContentSeparatorStyles = "";
            }
            break;
        case "Footer":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.CardFooterStyles = {
                        "Footer": "card-background-1"
                    };
                } else {
                    cd.CardFooterStyles = {
                        "Footer": "card-background-2"
                    };
                }
            } else {
                cd.CardFooterStyles = {};
            }
            break;
        case "FooterAction":
            if (value && value.length) {
                if (value[0].ReturnValue === "Style 1") {
                    cd.FooterActionStyles = {
                        "Image": "card-font-icon-1",
                        "Button": "card-button-1"
                    };
                } else {
                    cd.FooterActionStyles = {
                        "Image": "card-font-icon-2",
                        "Button": "card-button-2"
                    };
                }
            } else {
                cd.FooterActionStyles = {};
            }
            break;
    }
}