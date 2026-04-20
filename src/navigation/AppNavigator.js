import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { COLORS } from '../utils/theme';
import { useAuth } from '../context/AuthContext';

import HomeScreen from '../screens/HomeScreen';
import AnaesthesiaCalculatorsScreen from '../screens/AnaesthesiaCalculatorsScreen';
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
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

const MainStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: COLORS.medicalBlue },
        headerTintColor: COLORS.white,
        headerTitleStyle: { fontWeight: '600', fontSize: 16 },
        headerBackTitleVisible: false,
      }}
    >
      <MainStack.Screen name="Home" component={HomeScreen} options={{ title: 'WGH Anaesthesia' }} />
      <MainStack.Screen name="AnaesthesiaCalculators" component={AnaesthesiaCalculatorsScreen} options={{ title: 'Anaesthesia Calculators' }} />
      <MainStack.Screen name="Preoperative" component={PreoperativeScreen} options={{ title: 'Preoperative Assessment' }} />
      <MainStack.Screen name="Postoperative" component={PostoperativeScreen} options={{ title: 'Postoperative & Recovery' }} />
      <MainStack.Screen name="ICUCalculators" component={ICUCalculatorsScreen} options={{ title: 'ICU Calculators' }} />
      <MainStack.Screen name="Emergency" component={EmergencyScreen} options={{ title: 'Emergency & Crisis' }} />
      <MainStack.Screen name="Specialized" component={SpecializedScreen} options={{ title: 'Specialized Fields' }} />
      <MainStack.Screen name="QualitySafety" component={QualitySafetyScreen} options={{ title: 'Quality & Safety' }} />
      <MainStack.Screen name="GeneralMedical" component={GeneralMedicalScreen} options={{ title: 'General Medical' }} />
      <MainStack.Screen name="DrugDosing" component={DrugDosingScreen} options={{ title: 'Drug Dosing' }} />
      <MainStack.Screen name="ECMO" component={ECMOScreen} options={{ title: 'ECMO Parameters' }} />
      <MainStack.Screen name="AnestheticDrugDosing" component={AnestheticDrugDosingScreen} options={{ title: 'Anaesthetic Drugs' }} />
      <MainStack.Screen name="DifficultAirway" component={DifficultAirwayScreen} options={{ title: 'Difficult Airway' }} />
      <MainStack.Screen name="ACLS" component={ACLSScreen} options={{ title: 'ACLS Algorithms' }} />
      <MainStack.Screen name="DepartmentalTeaching" component={DepartmentalTeachingScreen} options={{ title: 'Departmental Teaching' }} />
      <MainStack.Screen name="CriticalTransfer" component={CriticalTransferScreen} options={{ title: 'Critical Transfer' }} />
      <MainStack.Screen name="NeuraxialAnticoagulation" component={NeuraxialAnticoagulationScreen} options={{ title: 'Neuraxial & Anticoagulation' }} />
      <MainStack.Screen name="DepartmentalProtocols" component={DepartmentalProtocolsScreen} options={{ title: 'Departmental Protocols' }} />
      <MainStack.Screen name="PerioperativeMedication" component={PerioperativeMedicationScreen} options={{ title: 'Perioperative Medication' }} />
      <MainStack.Screen name="ROTEM" component={ROTEMScreen} options={{ title: 'ROTEM' }} />
      <MainStack.Screen name="LabourAnalgesia" component={LabourAnalgesiaScreen} options={{ title: 'Labour Analgesia' }} />
      <MainStack.Screen name="ELibrary" component={ELibraryScreen} options={{ title: 'E-Library' }} />
    </MainStack.Navigator>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
