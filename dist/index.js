Object.defineProperty(exports, '__esModule', { value: true });

var mobx = require('mobx');
var React = require('react');
var moment = require('moment');
var reactFilepond = require('react-filepond');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var moment__default = /*#__PURE__*/_interopDefaultLegacy(moment);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __decorate(decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "/*\nCopyright 2005 - 2021 Advantage Solutions, s. r. o.\n\nThis file is part of ORIGAM (http://www.origam.org).\n\nORIGAM is free software: you can redistribute it and/or modify\nit under the terms of the GNU General Public License as published by\nthe Free Software Foundation, either version 3 of the License, or\n(at your option) any later version.\n\nORIGAM is distributed in the hope that it will be useful,\nbut WITHOUT ANY WARRANTY; without even the implied warranty of\nMERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the\nGNU General Public License for more details.\n\nYou should have received a copy of the GNU General Public License\nalong with ORIGAM. If not, see <http://www.gnu.org/licenses/>.\n*/\n.styles-module_mainContainer__WgAfS {\n  flex-grow: 1;\n  position: relative;\n  margin: auto;\n  height: 95%;\n  width: 100%;\n  background-color: white;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN0eWxlcy5tb2R1bGUuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0FpQkM7QUFDRDtFQUNFLFlBQVk7RUFDWixrQkFBa0I7RUFDbEIsWUFBWTtFQUNaLFdBQVc7RUFDWCxXQUFXO0VBQ1gsdUJBQXVCO0FBQ3pCIiwiZmlsZSI6InN0eWxlcy5tb2R1bGUuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi8qXG5Db3B5cmlnaHQgMjAwNSAtIDIwMjEgQWR2YW50YWdlIFNvbHV0aW9ucywgcy4gci4gby5cblxuVGhpcyBmaWxlIGlzIHBhcnQgb2YgT1JJR0FNIChodHRwOi8vd3d3Lm9yaWdhbS5vcmcpLlxuXG5PUklHQU0gaXMgZnJlZSBzb2Z0d2FyZTogeW91IGNhbiByZWRpc3RyaWJ1dGUgaXQgYW5kL29yIG1vZGlmeVxuaXQgdW5kZXIgdGhlIHRlcm1zIG9mIHRoZSBHTlUgR2VuZXJhbCBQdWJsaWMgTGljZW5zZSBhcyBwdWJsaXNoZWQgYnlcbnRoZSBGcmVlIFNvZnR3YXJlIEZvdW5kYXRpb24sIGVpdGhlciB2ZXJzaW9uIDMgb2YgdGhlIExpY2Vuc2UsIG9yXG4oYXQgeW91ciBvcHRpb24pIGFueSBsYXRlciB2ZXJzaW9uLlxuXG5PUklHQU0gaXMgZGlzdHJpYnV0ZWQgaW4gdGhlIGhvcGUgdGhhdCBpdCB3aWxsIGJlIHVzZWZ1bCxcbmJ1dCBXSVRIT1VUIEFOWSBXQVJSQU5UWTsgd2l0aG91dCBldmVuIHRoZSBpbXBsaWVkIHdhcnJhbnR5IG9mXG5NRVJDSEFOVEFCSUxJVFkgb3IgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UuIFNlZSB0aGVcbkdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlIGZvciBtb3JlIGRldGFpbHMuXG5cbllvdSBzaG91bGQgaGF2ZSByZWNlaXZlZCBhIGNvcHkgb2YgdGhlIEdOVSBHZW5lcmFsIFB1YmxpYyBMaWNlbnNlXG5hbG9uZyB3aXRoIE9SSUdBTS4gSWYgbm90LCBzZWUgPGh0dHA6Ly93d3cuZ251Lm9yZy9saWNlbnNlcy8+LlxuKi9cbi5tYWluQ29udGFpbmVyIHtcbiAgZmxleC1ncm93OiAxO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG1hcmdpbjogYXV0bztcbiAgaGVpZ2h0OiA5NSU7XG4gIHdpZHRoOiAxMDAlO1xuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZTtcbn0iXX0= */";
var S = {"mainContainer":"styles-module_mainContainer__WgAfS"};
styleInject(css_248z);

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
var apiurl = "ApiUrl";
var filterFileType = "FilterFileType";
var FileUploadPlugin = /** @class */ (function () {
    function FileUploadPlugin() {
        this.$type_ISectionPlugin = 1;
        this.id = "";
        this.initialized = false;
    }
    FileUploadPlugin.prototype.initialize = function (xmlAttributes) {
        this.apiurl = this.getXmlParameter(xmlAttributes, apiurl);
        this.filterFileType = this.getXmlParameter(xmlAttributes, filterFileType);
        this.initialized = true;
    };
    FileUploadPlugin.prototype.getXmlParameter = function (xmlAttributes, parameterName) {
        if (!xmlAttributes[parameterName]) {
            throw new Error("Parameter ".concat(parameterName, " was not found."));
        }
        return xmlAttributes[parameterName];
    };
    FileUploadPlugin.prototype.getComponent = function (data, createLocalizer) {
        var localizer = createLocalizer([]);
        var files = React.useState([])[0];
        moment__default["default"].locale(localizer.locale);
        if (!this.initialized) {
            return React__default["default"].createElement(React__default["default"].Fragment, null);
        }
        return (React__default["default"].createElement("div", { className: S.mainContainer },
            React__default["default"].createElement(reactFilepond.FilePond, { files: files, allowReorder: true, allowMultiple: true, labelIdle: 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>' })));
    };
    __decorate([
        mobx.observable
    ], FileUploadPlugin.prototype, "initialized", void 0);
    __decorate([
        mobx.observable
    ], FileUploadPlugin.prototype, "getScreenParameters", void 0);
    return FileUploadPlugin;
}());

exports.FileUploadPlugin = FileUploadPlugin;
//# sourceMappingURL=index.js.map
