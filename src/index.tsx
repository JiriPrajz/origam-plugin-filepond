import S from './styles.module.scss';
import { observable } from "mobx";
import React, { useState, useEffect } from "react";
import { IScreenPlugin } from "plugins/interfaces/IScreenPlugin";
import { IScreenPluginData } from "plugins/interfaces/IScreenPluginData";
import { ILocalization } from "plugins/interfaces/ILocalization";
import { ILocalizer } from "plugins/interfaces/ILocalizer";

import { FilePond,registerPlugin } from "react-filepond";
import FilePondPluginFileValidateType from 'filepond-plugin-file-validate-type';

import 'filepond/dist/filepond.min.css'


// Import the Image EXIF Orientation and Image Preview plugins
// Note: These need to be installed separately
import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

// Register the plugins
registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

// Register the plugin
registerPlugin(FilePondPluginFileValidateType);


const apiurl = "ApiUrl";
const filterFileType = "FilterFileType";
const invalidFileTypeMessage = "InvalidFileTypeMessage"
const maxParallelUploads = "MaxParallelUploads"
const instantUpload = "InstantUpload"

export class FileUploadPlugin implements IScreenPlugin {
  createLocalizer: ((localizations: ILocalization[]) => ILocalizer) | undefined;
  onSessionRefreshed(): void {
    
  }
  requestSessionRefresh: (() => Promise<any>) | undefined;
  setScreenParameters: ((parameters: { [key: string]: string; }) => void) | undefined;
  $type_IScreenPlugin: 1 = 1;
  id: string = ""
  apiurl: string = "";
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

  getComponent(data: IScreenPluginData, createLocalizer: (localizations: ILocalization[]) => ILocalizer): JSX.Element {
    this.createLocalizer = createLocalizer;
    if (!this.initialized) {
      return <></>;
    }
    return (<FilePondComponent 
                    fileType={this.filterFileType} 
                    apiurl={this.apiurl} 
                    invalidFileTypeMessage={this.invalidFileTypeMessage} 
                    instantUpload={this.instantUpload} 
                    maxParallelUploads={this.maxParallelUploads}

            />
           );
  }
  @observable
  getScreenParameters: (() => { [parameter: string]: string }) | undefined;
}

export const FilePondComponent: React.FC<{
  fileType: string | undefined;
  apiurl: string;
  invalidFileTypeMessage: string | undefined;
  instantUpload: boolean | undefined;
  maxParallelUploads: number | undefined;
}> = (props) => {
  const ftype: string = props.fileType ?? "";
  const [files, setFiles] = useState<File[]>([]);

  function getAuthorization(): string {
    const token = sessionStorage.getItem("origamAuthToken");
    if (token != null) {
      return `Bearer ${token}`;
    }
    return ""; // Ensure the return type is always a string
  }

  // Funkce pro smazání souboru
  async function deleteFile(fileId: string): Promise<void> {
    const confirmDelete = window.confirm("Opravdu chcete smazat tento soubor?");
    if (!confirmDelete) {
      return; // Pokud uživatel nepotvrdí, akce se zruší
    }

    try {
      const response = await fetch(`${props.apiurl}/files/${fileId}`, {
        method: "DELETE",
        headers: {
          Authorization: getAuthorization(),
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete file: ${response.statusText}`);
      }

      // Po úspěšném smazání aktualizujeme stav `files`
      setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileId));
      alert("Soubor byl úspěšně smazán.");
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("Nepodařilo se smazat soubor.");
    }
  }

  // Načtení souborů při inicializaci komponenty
  useEffect(() => {
    async function fetchFiles() {
      try {
        const response = await fetch(`${props.apiurl}/files`, {
          headers: {
            Authorization: getAuthorization(),
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch files: ${response.statusText}`);
        }

        const data = await response.json();
        // Předpokládáme, že server vrací pole souborů s vlastností `file`
        const initialFiles = data.map((file: any) => ({
          source: file.id, // Unikátní identifikátor souboru
          options: {
            type: "local",
          },
        }));
        setFiles(initialFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    }

    fetchFiles();
  }, [props.apiurl]); // Spustí se pouze při změně `props.apiurl`

  return (
    <div className={S.mainContainer}>
      <div className={S.subContainer}>
        <div className="FilePondComponent">
          <FilePond
            server={{
              process: {
                url: props.apiurl,
                headers: {
                  Authorization: getAuthorization(),
                },
              },
              revert: async (uniqueFileId, load, error) => {
                try {
                  await deleteFile(uniqueFileId); // Volání funkce pro smazání souboru
                  load(); // Informuje FilePond, že soubor byl úspěšně smazán
                } catch (err) {
                  error("Nepodařilo se smazat soubor.");
                }
              }
            }}
            allowFileTypeValidation={true}
            acceptedFileTypes={[ftype]}
            labelFileTypeNotAllowed={props.invalidFileTypeMessage}
            instantUpload={props.instantUpload ?? false}
            maxParallelUploads={props.maxParallelUploads ?? 1}
            files={files}
            allowReorder={true}
            allowMultiple={true}
            onupdatefiles={(fileItems) => {
              setFiles(fileItems.map((fileItem) => fileItem.file as File));
            }}
            onerror={(error: any) => {
              if (error.code == 401) {
                alert("Please logout and login again.");
              } else {
                alert(error.body);
              }
            }}
            labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
          />
        </div>
      </div>
    </div>
  );
};