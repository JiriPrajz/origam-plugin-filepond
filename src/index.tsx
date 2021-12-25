/*
Copyright 2005 - 2021 Advantage Solutions, s. r. o.

This file is part of ORIGAM (http://www.origam.org).

ORIGAM is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

ORIGAM is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with ORIGAM. If not, see <http://www.gnu.org/licenses/>.
*/

import S from './styles.module.scss';
import { observable } from "mobx";
import React, { useState } from "react";
import moment from "moment";
import {
  ILocalization,
  ILocalizer,
  IPluginData,
  ISectionPlugin
} from "@origam/plugin-interfaces";
import { FilePond,registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugin
registerPlugin(FilePondPluginFileValidateType);


const apiurl = "ApiUrl";
const filterFileType = "FilterFileType";
const invalidFileTypeMessage = "InvalidFileTypeMessage"

export class FileUploadPlugin implements ISectionPlugin {
  $type_ISectionPlugin: 1 = 1;
  id: string = ""
  apiurl: string ;
  filterFileType: string | undefined;
  invalidFileTypeMessage: string | undefined;

  @observable
  initialized = false;

  initialize(xmlAttributes: { [key: string]: string }): void {
    this.apiurl = this.getXmlParameter(xmlAttributes, apiurl);
    this.filterFileType = this.getXmlParameter(xmlAttributes, filterFileType);
    this.invalidFileTypeMessage = this.getXmlParameter(xmlAttributes, invalidFileTypeMessage);
    this.initialized = true;
  }
  getXmlParameter(xmlAttributes: { [key: string]: string }, parameterName: string) {
    if (!xmlAttributes[parameterName]) {
      throw new Error(`Parameter ${parameterName} was not found.`)
    }
    return xmlAttributes[parameterName];
  }


   
  getComponent(data: IPluginData, createLocalizer: (localizations: ILocalization[]) => ILocalizer): JSX.Element {
    const localizer = createLocalizer([]);
    const [files] = useState([]);
    const setFiles:any = useState([]);
    const fileType:string[] = [filterFileType];
    moment.locale(localizer.locale)
    if (!this.initialized) {
      return <></>;
    }
    
    return (
      <div className={S.mainContainer}>
           <FilePond
        server={apiurl}
        allowFileTypeValidation={true}
        acceptedFileTypes={fileType}
        labelFileTypeNotAllowed={invalidFileTypeMessage}
        instantUpload={true}
        maxParallelUploads={1}
        files={files}
        allowReorder={true}
        allowMultiple={true}
        onupdatefiles={setFiles}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      </div>
    );
  }
  @observable
  getScreenParameters: (() => { [parameter: string]: string }) | undefined;
}