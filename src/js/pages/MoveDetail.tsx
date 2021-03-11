import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonPage } from '@ionic/react';
import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation, useParams } from 'react-router';
import GAME_DETAILS from '../constants/GameDetails'
import '../../style/components/DetailCards.scss';
import PageHeader from '../components/PageHeader';
import SubHeader from '../components/SubHeader';
import SegmentSwitcher from '../components/SegmentSwitcher';
import { setActiveGame, setPlayerAttr } from '../actions';
import { activeGameSelector, activePlayerSelector, selectedCharactersSelector } from '../selectors';


const MoveDetail = () => {

  const selectedCharacters = useSelector(selectedCharactersSelector);
  const activePlayer = useSelector(activePlayerSelector);
  const activeGame = useSelector(activeGameSelector);

  const dispatch = useDispatch();

  const slugs = useParams();
  const modeBackTo = useLocation().pathname.split("/")[1];

  useEffect(() => {

    if (activeGame !== slugs.gameSlug) {
      console.log(activeGame)
      console.log("URL game mismatch");
      dispatch(setActiveGame(slugs.gameSlug));
    }
    
    if ((selectedCharacters[activePlayer].name !== slugs.characterSlug || selectedCharacters[activePlayer].vtState !== slugs.vtStateSlug) ) {
      console.log("URL character/vtState mismatch");
      console.log(slugs)
      dispatch(setPlayerAttr(activePlayer, slugs.characterSlug, {vtState: slugs.vtStateSlug}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (activePlayer === "playerOne") {
      console.log("URL movename mismatch")
      const urlMove = Object.keys(selectedCharacters[activePlayer].frameData).filter(moveDetail => {
        return selectedCharacters[activePlayer].frameData[moveDetail].moveName === slugs.moveNameSlug
      })
      dispatch(setPlayerAttr("playerOne", slugs.characterSlug, {selectedMove: urlMove}));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCharacters["playerOne"].name])

  const activeCharName = selectedCharacters[activePlayer].name;
  const charFrameData = selectedCharacters[activePlayer].frameData;
  const selectedMoveName = selectedCharacters[activePlayer].selectedMove;
  const selectedMoveData = charFrameData[selectedMoveName];

  if (!selectedMoveData) {
    <IonPage>
      {/* Something's gone wrong */}
    </IonPage>
  }


  const universalDataPoints = GAME_DETAILS[activeGame].universalDataPoints;
  const specificCancelRows = GAME_DETAILS[activeGame].specificCancels ? GAME_DETAILS[activeGame].specificCancels.filter(cancelRow =>
    Object.keys(cancelRow).every(key => selectedMoveData[key] !== undefined)
  ) : [];

  return (
    <IonPage>
      <PageHeader
        componentsToShow={
          modeBackTo === "yaksha"
            ? {customBackUrl: `/${modeBackTo}`}
            : {customBackUrl: `/${modeBackTo}/${activeGame}/${activeCharName}`}
          
          
        }
        title={`${selectedMoveName} | ${activeCharName}`}
      />

      <IonContent id="moveDetail">

        <SubHeader
          rowsToDisplay={[
            [
              <><b>Official Name</b><br />{selectedMoveData["moveName"]}</>,
              <><b>Common Name</b><br />{selectedMoveData["cmnName"] ? selectedMoveData["cmnName"] : selectedMoveData["moveName"]}</>
            ],
            [
              <><b>Motion</b><br />{selectedMoveData["plnCmd"]}</>,
              <><b>NumPad</b><br />{selectedMoveData["numCmd"]}</>
            ]
          ]}
        />

        {activeGame === "SFV" && !selectedMoveData["uniqueInVt"] &&
          <SegmentSwitcher
            segmentType={"vtrigger"}
            valueToTrack={selectedCharacters[activePlayer].vtState}
            labels={ {normal: "Normal", vtOne: "V-Trigger I" , vtTwo: "V-Trigger II"} }
            clickFunc={ (eventValue) => dispatch(setPlayerAttr(activePlayer, selectedCharacters[activePlayer].name, {vtState: eventValue})) }
          />
        }
        <div id="flexCardContainer">

          {/* Generic Entries */}

          {Object.keys(universalDataPoints).filter(dataSection =>
            universalDataPoints[dataSection].some(dataRow =>
              Object.keys(dataRow).some(dataKey => selectedMoveData[dataKey] !== undefined)
            )
          ).map(dataSection => (
            <IonCard key={dataSection} className={dataSection === "Extra Information" && "final-card"}>
              <IonCardHeader>
                <IonCardTitle>{dataSection}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {universalDataPoints[dataSection].map((dataRow, index) =>
                  dataSection !== "Extra Information" ?
                    <div key={index} className="row">
                      {Object.entries(dataRow).map(([dataId, headerObj]) => {
                          if (dataId === "cancelsTo") {
                            return <div className={selectedMoveData.changedValues && selectedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"} key={dataId}><b>{headerObj.detailedHeader}</b><br/>{selectedMoveData[dataId] || selectedMoveData[dataId] === 0 ? selectedMoveData[dataId].join(", ") : "~"}</div>
                          } else {
                            return <div className={selectedMoveData.changedValues && selectedMoveData.changedValues.includes(dataId) ? "triggered-data" : "normal-state"} key={dataId}><b>{headerObj.detailedHeader}</b><br/>{selectedMoveData[dataId] || selectedMoveData[dataId] === 0 ? selectedMoveData[dataId] : "~"}</div>
                          }
                      })}
                    </div>
                    : <ul key={index}>
                        {selectedMoveData["extraInfo"].map((info, index) =>
                          <li key={index}>{info}</li>
                        )}
                      </ul>


                )}
              </IonCardContent>
            </IonCard>

          ))}


          {/* Character Specific Cancels Entries */}
          {!!specificCancelRows.length &&
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Specific Cancels</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                {specificCancelRows.map((dataRow, index) =>
                  <div key={index} className="row">
                    {Object.entries(dataRow).map(([dataId, headerObj]) =>
                      <div key={dataId}><b>{headerObj.detailedHeader}</b><br/>{selectedMoveData[dataId]}</div>
                    )}
                  </div>
                )}
              </IonCardContent>
            </IonCard>
          }

        </div>

      </IonContent>
    </IonPage>
  );
};

export default MoveDetail;
