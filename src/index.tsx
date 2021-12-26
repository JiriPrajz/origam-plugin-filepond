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
import React, { Component, useState } from "react";
import moment from "moment";
import {
  ILocalization,
  ILocalizer,
  IPluginData,
  IScreenPlugin 
} from "@origam/plugin-interfaces";
import { FilePond,registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

// Register the plugin
registerPlugin(FilePondPluginFileValidateType);


const apiurl = "ApiUrl";
const filterFileType = "FilterFileType";
const invalidFileTypeMessage = "InvalidFileTypeMessage"

export class FileUploadPlugin implements IScreenPlugin {
  $type_IScreenPlugin: 1 = 1;
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

  requestSessionRefresh: (() => Promise<any>) | undefined;
   
   getComponent(data: IPluginData, createLocalizer: (localizations: ILocalization[]) => ILocalizer): JSX.Element {
    const localizer = createLocalizer([]);
    
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
        files={GetFiles()}
        allowReorder={true}
        allowMultiple={true}
        onupdatefiles={SetFiles()}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      </div>
    );
  }
  @observable
  setScreenParameters: ((parameters: { [p: string]: string }) => void) | undefined;
}
class App extends Component {
  pond: FilePond | null;
  constructor(props:any) {
    super(props);

    this.state = {
      // Set initial files, type 'local' means this is a file
      // that has already been uploaded to the server (see docs)
      files: [
        {
          source: "index.html",
          options: {
            type: "local"
          }
        }
      ]
    };
  }

  handleInit() {
    //console.log("FilePond instance has initialised", this.pond);
  }


  render() {
    return (
      <div className="App">
        <FilePond
          ref={ref => (this.pond = ref)}
          files={this.state}
          allowMultiple={true}
          allowReorder={true}
          maxFiles={3}
          server="/api"
          name="files" {/* sets the file input name, it's filepond by default */}
          oninit={() => this.handleInit()}
          onupdatefiles={fileItems => {
            // Set currently active file objects to this.state
            this.setState({
              files: fileItems.map(fileItem => fileItem.file)
            });
          }}
        />
      </div>
    );
  }
}