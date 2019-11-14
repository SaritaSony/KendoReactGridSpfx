import * as React from 'react';
import { IKendoSpFxProps } from './IKendoSpFxProps';
import { IKendoSpFxState } from './IKendoSpFxState';
import { Grid, GridColumn, GridCellProps } from '@progress/kendo-react-grid';
import { process} from '@progress/kendo-data-query';
import '@progress/kendo-theme-default';

import { data } from './GridData';

let lastSelectedIndex = 0;

class IconCell extends React.Component<GridCellProps,{}>{
  constructor(props) {
      super(props);
  }

  public render(){        
    const value = this.props.dataItem[this.props.field];
      return (
          <td>
              <div className="table-actions">
                <a href={"https://www.google.com?Mode=View&RequestId=" + value}>
                  {value}
                </a>               
              </div>
          </td>
      );
  }
}

export default class KendoSpFx extends React.Component<IKendoSpFxProps, IKendoSpFxState> {
  
  constructor(props){
    super(props);
    this.state = {
      gridData: data.map(dataItem => Object.assign({ selected: false }, dataItem)),
      dataState: { skip: 0, take: 20},      
    };
  }
   
  private selectionChange = (event) => {
    event.dataItem.selected = !event.dataItem.selected;
    this.forceUpdate();
  }

  private rowClick = (event) => {
    let last = lastSelectedIndex;
    const current = this.state.gridData.findIndex(dataItem => dataItem === event.dataItem);

    if (!event.nativeEvent.shiftKey) {
        lastSelectedIndex = last = current;
    }

    if (!event.nativeEvent.ctrlKey) {
        this.state.gridData.forEach(item => item.selected = false);
    }
    const select = !event.dataItem.selected;
    for (let i = Math.min(last, current); i <= Math.max(last, current); i++) {
        this.state.gridData[i].selected = select;
    }
    this.forceUpdate();
}

private headerSelectionChange = (event) => {
    const checked = event.syntheticEvent.target.checked;
    this.state.gridData.forEach(item => item.selected = checked);
    this.forceUpdate();
}

public expandChange = (event) => {
  event.dataItem[event.target.props.expandField] = event.value;
  this.setState({
          gridData: Object.assign({}, this.state.gridData),
          dataState: this.state.dataState
      });
  }

  public render(): React.ReactElement<IKendoSpFxProps> {

    let MyCustomCell = (props) => <IconCell {...props} />;

    return (
      <div>
        <Grid data={process(this.state.gridData,this.state.dataState)}
              pageable
              filterable
              sortable
              {...this.state.dataState}
              onDataStateChange={(e)=>this.setState({dataState: e.data})}
              selectedField="selected"
              onSelectionChange={this.selectionChange}
              onHeaderSelectionChange={this.headerSelectionChange}
              onRowClick={this.rowClick}
              groupable
              onExpandChange={this.expandChange}
              expandField="expanded"                                      
        >
          <GridColumn
            field="selected"
            width="50px"
            filterable={true}
            headerSelectionValue={
                this.state.gridData.findIndex(dataItem => dataItem.selected === false) === -1
            } />
          <GridColumn field="ProductID" title="ID" width="40px" filterable={false} />
          <GridColumn field="ProductName" title="Name" width="250px" />
          <GridColumn field="Category.CategoryName" title="CategoryName" />
          <GridColumn field="UnitPrice" title="Price" width="120px" />
          <GridColumn field="UnitsInStock" title="In stock" width="120px" />
          <GridColumn
              field="ProductID"
              cell={MyCustomCell}
          />
        </Grid>
      </div>
    );
  }
}
