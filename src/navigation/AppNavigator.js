import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../utils/theme';

import HomeScreen from '../screens/HomeScreen';
import PreoperativeScreen from '../screens/PreoperativeScreen';
import PostoperativeScreen from '../screens/PostoperativeScreen';
import ICUCalculatorsScreen from '../screens/ICUCalculatorsScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import SpecializedScreen from '../screens/SpecializedScreen';
import QualitySafetyScreen from '../screens/QualitySafetyScreen';
import GeneralMedicalScreen from '../screens/GeneralMedicalScreen';
import DrugDosingScreen from '../screens/DrugDosingScreen';
import ECMOScreen from '../screens/ECMOScreen';
import AnestheticDrugDosingScreen from '../screens/AnestheticDrugDosingScreen';
import DifficultAirwayScreen from '../screens/DifficultAirwayScreen';
import ACLSScreen from '../screens/ACLSScreen';
import DepartmentalTeachingScreen from '../screens/DepartmentalTeachingScreen';
import CriticalTransferScreen from '../screens/CriticalTransferScreen';
import NeuraxialAnticoagulationScreen from '../screens/NeuraxialAnticoagulationScreen';
import DepartmentalProtocolsScreen from '../screens/DepartmentalProtocolsScreen';
import PerioperativeMedicationScreen from '../screens/PerioperativeMedicationScreen';
import ROTEMScreen from '../screens/ROTEMScreen';
import LabourAnalgesiaScreen from '../screens/LabourAnalgesiaScreen';
import ELibraryScreen from '../screens/ELibraryScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          headerStyle: { backgroundColor: COLORS.medicalBlue },
          headerTintColor: COLORS.white,
          headerTitleStyle: { fontWeight: '600', fontSize: 16 },
          headerBackTitleVisible: false,
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'WGH Anaesthesia' }} />
        <Stack.Screen name="Preoperative" component={PreoperativeScreen} options={{ title: 'Preoperative Assessment' }} />
        <Stack.Screen name="Postoperative" component={PostoperativeScreen} options={{ title: 'Postoperative & Recovery' }} />
        <Stack.Screen name="ICUCalculators" component={ICUCalculatorsScreen} options={{ title: 'ICU Calculators' }} />
        <Stack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency & Crisis' }} />
        <Stack.Screen name="Specialized" component={SpecializedScreen} options={{ title: 'Specialized Fields' }} />
        <Stack.Screen name="QualitySafety" component={QualitySafetyScreen} options={{ title: 'Quality & Safety' }} />
        <Stack.Screen name="GeneralMedical" component={GeneralMedicalScreen} options={{ title: 'General Medical' }} />
        <Stack.Screen name="DrugDosing" component={DrugDosingScreen} options={{ title: 'Drug Dosing' }} />
        <Stack.Screen name="ECMO" component={ECMOScreen} options={{ title: 'ECMO Parameters' }} />
        <Stack.Screen name="AnestheticDrugDosing" component={AnestheticDrugDosingScreen} options={{ title: 'Anaesthetic Drugs' }} />
        <Stack.Screen name="DifficultAirway" component={DifficultAirwayScreen} options={{ title: 'Difficult Airway' }} />
        <Stack.Screen name="ACLS" component={ACLSScreen} options={{ title: 'ACLS Algorithms' }} />
        <Stack.Screen name="DepartmentalTeaching" component={DepartmentalTeachingScreen} options={{ title: 'Departmental Teaching' }} />
        <Stack.Screen name="CriticalTransfer" component={CriticalTransferScreen} options={{ title: 'Critical Transfer' }} />
        <Stack.Screen name="NeuraxialAnticoagulation" component={NeuraxialAnticoagulationScreen} options={{ title: 'Neuraxial & Anticoagulation' }} />
        <Stack.Screen name="DepartmentalProtocols" component={DepartmentalProtocolsScreen} options={{ title: 'Departmental Protocols' }} />
        <Stack.Screen name="PerioperativeMedication" component={PerioperativeMedicationScreen} options={{ title: 'Perioperative Medication' }} />
        <Stack.Screen name="ROTEM" component={ROTEMScreen} options={{ title: 'ROTEM' }} />
        <Stack.Screen name="LabourAnalgesia" component={LabourAnalgesiaScreen} options={{ title: 'Labour Analgesia' }} />
        <Stack.Screen name="ELibrary" component={ELibraryScreen} options={{ title: 'E-Library' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
