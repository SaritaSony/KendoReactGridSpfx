import * as React from 'react';
import * as ReactDom from 'react-dom';

import 'core-js/es7/map';
import 'core-js/es6/array';
import 'core-js/fn/string/includes';

import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';

import * as strings from 'KendoSpFxWebPartStrings';
import KendoSpFx from './components/KendoSpFx';
import { IKendoSpFxProps } from './components/IKendoSpFxProps';

export interface IKendoSpFxWebPartProps {
  description: string;
}

export default class KendoSpFxWebPart extends BaseClientSideWebPart<IKendoSpFxWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IKendoSpFxProps > = React.createElement(
      KendoSpFx,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
