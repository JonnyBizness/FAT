import { IonContent, IonModal, IonList, IonItem, IonItemDivider, IonLabel, IonCheckbox, IonIcon, } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';

import { setModalVisibility, setLandscapeCols } from '../actions';
import GAME_DETAILS from '../constants/GameDetails'

import '../../style/components/LandscapeOptions.scss';
import PageHeader from './PageHeader';
import { reloadOutline, closeOutline, medicalOutline } from 'ionicons/icons';

const LandscapeOptions =({
  landscapeCols,
  setLandscapeCols,
  modalVisibility,
  setModalVisibility,
  selectedCharacters,
  activeGame,
}) => {

  const handleCheckboxClick = (dataEntryKey, dataTableHeader) => {
    
    const keysInOrder = []
    const landscapeColsInOrder = {}

    // extract the keys from the 2 data table entry files so we can order our landscape cols
    Object.keys(GAME_DETAILS[activeGame].universalDataPoints).forEach(dataCategory =>
      GAME_DETAILS[activeGame].universalDataPoints[dataCategory].forEach(dataRow =>
        Object.keys(dataRow).forEach(dataEntryKey =>
          keysInOrder.push(dataEntryKey)
        )
      )
    )
    GAME_DETAILS[activeGame].specificCancels.forEach(dataCategory =>
      Object.keys(dataCategory).forEach(dataRow =>
        keysInOrder.push(dataCategory[dataRow].dataFileKey)
      )
    )

    // Handle the new column
    if (!landscapeCols[dataEntryKey]) {
      landscapeCols = {...landscapeCols, [dataEntryKey]: dataTableHeader}
    } else {
      delete landscapeCols[dataEntryKey];
    }
    
    // reorder the landscape columns before returning it
    keysInOrder.forEach(detailKey => {
      Object.keys(landscapeCols).forEach(key => {
        if (detailKey === key) {
          landscapeColsInOrder[key] = landscapeCols[key]
        }
      })
    })

    setLandscapeCols({...landscapeColsInOrder})
  }

  const handleModalDismiss = () => {
    if (Object.keys(landscapeCols).length === 0) {
      setLandscapeCols({startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", kd:"kd", kdr:"kdr", kdrb:"kdrb"})
      modalVisibility.visible && setModalVisibility({ currentModal: "landscapeOptions", visible: false })
    } else {
      modalVisibility.visible && setModalVisibility({ currentModal: "landscapeOptions", visible: false })
    }
  }

  return(
    <IonModal
      isOpen={modalVisibility.visible && modalVisibility.currentModal === "landscapeOptions"}
      onDidDismiss={ () => {
        handleModalDismiss();
      } }
    >
      <PageHeader
        buttonsToShow={[{ slot: "end",
          buttons: [
            { text: <IonIcon icon={medicalOutline} />, buttonFunc() {return setLandscapeCols({})}},
            { text: <IonIcon icon={reloadOutline} />, buttonFunc() {return setLandscapeCols({startup: "S", active: "A", recovery: "R", onBlock: "oB", onHit: "oH", damage:"dmg", stun:"stun", kd:"kd", kdr:"kdr", kdrb:"kdrb"})}},
            { text: <IonIcon icon={closeOutline} />, buttonFunc() {return handleModalDismiss()}}
          ]
        }]}
        title="Landscape Options"
      />

      <IonContent id="LandscapeOptions">
        <IonList>
          {GAME_DETAILS[activeGame].specificCancels &&
            [selectedCharacters.playerOne.name, selectedCharacters.playerTwo.name].map((playerName, index) =>
            <div className="list-section" key={`${playerName}${index} cancels`}>
              <IonItemDivider>Showing cancels for {playerName}</IonItemDivider>
              {GAME_DETAILS[activeGame].specificCancels.map(dataRow =>
                Object.keys(dataRow).filter(dataEntryKey =>
                  dataRow[dataEntryKey].usedBy.includes(playerName)
                ).map(dataEntryKey =>
                  <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                    <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                    <IonCheckbox slot="end" checked={landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => handleCheckboxClick(dataEntryKey, dataRow[dataEntryKey].dataTableHeader)} />
                  </IonItem>
                )
              )}
            </div>
          )}
          {Object.keys(GAME_DETAILS[activeGame].universalDataPoints).map(dataCategory =>
            <div className="list-section" key={dataCategory}>
              <IonItemDivider>{dataCategory}</IonItemDivider>
              {GAME_DETAILS[activeGame].universalDataPoints[dataCategory].map(dataRow =>
                Object.keys(dataRow).map((dataEntryKey) =>
                  <IonItem key={dataRow[dataEntryKey].dataFileKey}>
                    <IonLabel>{dataRow[dataEntryKey].detailedHeader}</IonLabel>
                    <IonCheckbox slot="end" checked={landscapeCols[dataEntryKey]} value={dataRow[dataEntryKey].dataFileKey} onClick={() => handleCheckboxClick(dataEntryKey, dataRow[dataEntryKey].dataTableHeader)} />
                  </IonItem>
                )
              )}
            </div>
          )}
        </IonList>
      </IonContent>
    </IonModal>
  )
}

const mapStateToProps = state => ({
  modalVisibility: state.modalVisibilityState,
  selectedCharacters: state.selectedCharactersState,
  landscapeCols: state.landscapeColsState,
  activeGame: state.activeGameState,
})

const mapDispatchToProps = dispatch => ({
  setModalVisibility: (data)  => dispatch(setModalVisibility(data)),
  setLandscapeCols: (listOfCols) => dispatch(setLandscapeCols(listOfCols)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(LandscapeOptions);