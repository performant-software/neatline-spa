import React from 'react';

const ExhibitEditorButtons = ({onClickSettings, onClickRecords, onClickPublic, onClickSave}) => {

    return (
        <div>
            <div id="neatline-actions" className="neatline-actions menu-condensed">
            <button
                onClick={onClickSettings}>
                <i className="fas fa-cogs"></i>
            </button>
            <button
                onClick={onClickRecords}>
                <i className="fas fa-list-ul"></i>
            </button>
            <button
                onClick={onClickPublic}>
                <i className="fas fa-eye"></i>
            </button>
            <button className="save-button" onClick={onClickSave}>Save <i className="fas fa-save"></i></button>
        </div>
        <div id="neatline-actions" className="neatline-actions menu-full">
            <button
                onClick={onClickSettings}>
                Exhibit Settings <i className="fas fa-cogs"></i>
            </button>
            <button
                onClick={onClickRecords}>
                Records <i className="fas fa-list-ul"></i>
            </button>
            <button
                onClick={onClickPublic}>
                Public View <i className="fas fa-eye"></i>
            </button>
            <button
                className="save-button"
                onClick={onClickSave}>
                Save <i className="fas fa-save"></i>
            </button>
        </div>
    </div>
    )
}

export default ExhibitEditorButtons;