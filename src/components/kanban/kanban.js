import React, { useEffect, useState } from 'react';
import { extend, addClass } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsDirective, ColumnDirective } from "@syncfusion/ej2-react-kanban";
import * as dataSource from '../../assets/data/kanban.json';
import './kanban.css';

const Kanban = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        setData(extend([], dataSource, null, true));
    }, []);

    const fields = [
        { text: "ID", key: "Title", type: "TextBox" },
        { key: "Status", type: "DropDown" },
        { key: "Assignee", type: "DropDown" },
        { key: "RankId", type: "TextBox" },
        { key: "Summary", type: "TextArea" },
    ];

    const cardRendered = (args) => {
        let val = args.data.Priority;
        addClass([args.element], val);
    };

    const columnTemplate = (props) => (
        <div className="header-template-wrap">
            <div className={"header-icon e-icons " + props.keyField}></div>
            <div className="header-text">{props.headerText}</div>
        </div>
    );

    const cardTemplate = (props) => (
        <div className={"card-template"}>
            <div className="e-card-header">
                <div className="e-card-header-caption">
                    <div className="e-card-header-title e-tooltip-text">
                        {props.Title}
                    </div>
                    
                </div>
            </div>
            <div className="e-card-content e-tooltip-text">
                <div className="e-text">{props.Summary}</div>
            </div>
            <div className="e-card-custom-footer">
                <div className="e-card-avatar">{getString(props.Assignee)}</div>
            </div>
        </div>
    );

    const getString = (assignee) => {
        if (assignee) {
            return assignee
                .split(' ')
                .map((word) => word[0].toUpperCase())
                .join('');
        }
        return '';
    };

    return (
        <div className="schedule-control-section">
            <div className="col-lg-12 control-section">
                <div className="control-wrapper">
                    <KanbanComponent
                        id="kanban"
                        cssClass="kanban-overview"
                        keyField="Status"
                        dataSource={data}
                        enableTooltip={true}
                        cardSettings={{
                            headerField: "Title",
                            template: cardTemplate,
                            selectionType: "Multiple",
                        }}
                        dialogSettings={{ fields: fields }}
                        cardRendered={cardRendered}
                    >
                        <ColumnsDirective>
                            <ColumnDirective headerText="To Do" keyField="Open" allowToggle={true} template={columnTemplate} />
                            <ColumnDirective headerText="In Progress" keyField="InProgress" allowToggle={true} template={columnTemplate} />
                            <ColumnDirective headerText="In Review" keyField="Review" allowToggle={true} template={columnTemplate} />
                            <ColumnDirective headerText="Done" keyField="Close" allowToggle={true} template={columnTemplate} />
                        </ColumnsDirective>
                    </KanbanComponent>
                </div>
            </div>
        </div>
    );
};

export default Kanban;
