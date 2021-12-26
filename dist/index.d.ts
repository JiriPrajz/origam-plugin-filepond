/// <reference types="react" />
import { ILocalization, ILocalizer, IPluginData, IScreenPlugin } from "@origam/plugin-interfaces";
export declare class FileUploadPlugin implements IScreenPlugin {
    $type_IScreenPlugin: 1;
    id: string;
    apiurl: string;
    filterFileType: string | undefined;
    invalidFileTypeMessage: string | undefined;
    initialized: boolean;
    initialize(xmlAttributes: {
        [key: string]: string;
    }): void;
    getXmlParameter(xmlAttributes: {
        [key: string]: string;
    }, parameterName: string): string;
    requestSessionRefresh: (() => Promise<any>) | undefined;
    getComponent(data: IPluginData, createLocalizer: (localizations: ILocalization[]) => ILocalizer): JSX.Element;
    setScreenParameters: ((parameters: {
        [p: string]: string;
    }) => void) | undefined;
}
