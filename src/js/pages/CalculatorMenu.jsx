import { IonContent, IonPage, IonList, IonListHeader, IonItem, IonLabel, IonIcon, isPlatform, IonItemGroup, IonGrid } from '@ionic/react';
import React from 'react';
import { connect } from 'react-redux';
import '../../style/pages/Calculators.scss';
import PageHeader from '../components/PageHeader';
import { bulbOutline, chevronForward, skullOutline, linkOutline, handLeftOutline, receiptOutline, peopleOutline, personRemoveOutline } from 'ionicons/icons';
import { useHistory } from 'react-router';
import { CALC_MENU_LIST } from '../constants/MenuLists'

const Calculators = () => {
  let history = useHistory();

  const icons = { bulbOutline, chevronForward, skullOutline, linkOutline, handLeftOutline, receiptOutline, peopleOutline, personRemoveOutline }
  const getIcon = (iconAsString) => {
    return icons[iconAsString]
  }

  return (
    <IonPage>
      <PageHeader
        componentsToShow={{menu: true, popover: true}}
        title="Calculator Menu"
      />

      <IonContent className="calculators">
        <IonGrid fixed>
          <IonList>
            {
              Object.keys(CALC_MENU_LIST).map(listHeader =>
                <IonItemGroup key={`${listHeader}-options`}>
                  <IonListHeader>{listHeader}</IonListHeader>
                  {Object.keys(CALC_MENU_LIST[listHeader]).map(calcType =>
                    <IonItem key={`${calcType}-calcItem`} lines="none" onClick={() => history.push(`/calculators/${CALC_MENU_LIST[listHeader][calcType].url}`)} button>
                      <IonLabel>
                        <h2>{calcType}</h2>
                        <p>{CALC_MENU_LIST[listHeader][calcType].desc}</p>
                      </IonLabel>
                      <IonIcon icon={	getIcon(CALC_MENU_LIST[listHeader][calcType].icon) } slot="start" />
                      {!isPlatform("ios") &&
                        <IonIcon icon={chevronForward} slot="end" />
                      }
                    </IonItem>
                  )}
                </IonItemGroup>
              )
            }
          </IonList>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

const mapStateToProps = state => ({
})

const mapDispatchToProps = dispatch => ({
})


export default connect(
  mapStateToProps,
  mapDispatchToProps,
)
(Calculators)