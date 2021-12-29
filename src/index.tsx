import S from './styles.module.scss';
import { observable } from "mobx";
import React, { useState } from "react";
import moment from "moment";
import {
  ILocalization,
  ILocalizer,
  IPluginData,
  IScreenPlugin
} from "@origam/plugin-interfaces";
import { FilePond,registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css'

// Register the plugin
registerPlugin(FilePondPluginFileValidateType);


const apiurl = "ApiUrl";
const filterFileType = "FilterFileType";
const invalidFileTypeMessage = "InvalidFileTypeMessage"
const maxParallelUploads = "MaxParallelUploads"
const instantUpload = "InstantUpload"

export class FileUploadPlugin implements IScreenPlugin {
  requestSessionRefresh: (() => Promise<any>) | undefined;
  setScreenParameters: ((parameters: { [key: string]: string; }) => void) | undefined;
  $type_IScreenPlugin: 1 = 1;
  id: string = ""
  apiurl: string ;
  filterFileType: string | undefined;
  invalidFileTypeMessage: string | undefined;
  instantUpload:boolean | undefined;
  maxParallelUploads:number | undefined;

  @observable
  initialized = false;

  initialize(xmlAttributes: { [key: string]: string }): void {
    this.apiurl = this.getXmlParameter(xmlAttributes, apiurl);
    this.filterFileType = this.getXmlParameter(xmlAttributes, filterFileType);
    this.invalidFileTypeMessage = this.getXmlParameter(xmlAttributes, invalidFileTypeMessage);
    this.instantUpload = (this.getXmlParameter(xmlAttributes, instantUpload) =="true");
    this.maxParallelUploads = Number.parseInt(this.getXmlParameter(xmlAttributes, maxParallelUploads));
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
    
    moment.locale(localizer.locale)
    if (!this.initialized) {
      return <></>;
    }
    return (<FilePondComponent fileType={this.filterFileType} apiurl={this.apiurl} invalidFileTypeMessage={this.invalidFileTypeMessage} 
    instantUpload={this.instantUpload} maxParallelUploads={this.maxParallelUploads} />    );
  }
  @observable
  getScreenParameters: (() => { [parameter: string]: string }) | undefined;
}

export const FilePondComponent: React.FC<{
  fileType:string | undefined;
  apiurl:string;
  invalidFileTypeMessage:string | undefined
  instantUpload:boolean | undefined
  maxParallelUploads:number | undefined

}> = (props) => {
  const ftype: string = props.fileType ?? "";
  const [files] = useState([])
  const [setFiles]:any = useState([])
  return (
    <div className={S.mainContainer}>
      <div className={S.subContainer}>
      <div className="FilePondComponent" >
           <FilePond
              server={
                {
                        process: (fieldname,file,metadata,load,error,progress, abort) => {
                          const request = new XMLHttpRequest();
                          request.open('POST', props.apiurl +"?filename=" +file.name);
                          request.setRequestHeader("Content-Type","text/xml");
                          request.upload.onprogress = (e) => {
                            progress(e.lengthComputable, e.loaded, e.total);
                        };
            
                        // Should call the load method when done and pass the returned server file id
                        // this server file id is then used later on when reverting or restoring a file
                        // so your server knows which file to return without exposing that info to the client
                        request.onload = function () {
                            if (request.status >= 200 && request.status < 300) {
                                // the load method accepts either a string (id) or an object
                                load(request.responseText);
                            } else {
                                // Can call the error method if something is wrong, should exit after
                                if(request.status == 401)
                                {
                                  error("Please logout and login again.");
                                }
                                error(request.status + ' ' + request.statusText);
                            }
                        };
                        request.send(file);
                        // Should expose an abort method so the request can be cancelled
                        return {
                          abort: () => {
                              // This function is entered if the user has tapped the cancel button
                              request.abort();

                              // Let FilePond know the request has been cancelled
                              abort();
                          },
                        };
                        },
                      }
                    }
                
        allowFileTypeValidation={true}
        acceptedFileTypes={[ftype]}
        labelFileTypeNotAllowed={props.invalidFileTypeMessage}
        instantUpload={props.instantUpload??false}
        maxParallelUploads={props.maxParallelUploads??1}
        files={files}
        allowReorder={true}
        allowMultiple={true}
        onupdatefiles={setFiles}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
      </div>
      </div>
      </div>
  )
}