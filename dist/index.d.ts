/// <reference types="react" />
import { ILocalization, ILocalizer, IPluginData, ISectionPlugin } from "@origam/plugin-interfaces";
export declare class FileUploadPlugin implements ISectionPlugin {
    $type_ISectionPlugin: 1;
    id: string;
    apiurl: string | undefined;
    filterFileType: string | undefined;
    initialized: boolean;
    initialize(xmlAttributes: {
        [key: string]: string;
    }): void;
    getXmlParameter(xmlAttributes: {
        [key: string]: string;
    }, parameterName: string): string;
    getComponent(data: IPluginData, createLocalizer: (localizations: ILocalization[]) => ILocalizer): JSX.Element;
    getScreenParameters: (() => {
        [parameter: string]: string;
    }) | undefined;
}
