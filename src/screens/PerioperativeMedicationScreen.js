import React, { useState, useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import ScreenWrapper from '../components/ScreenWrapper';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

const HERBAL_MEDICATIONS = [
  { name: '5-HTP', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and only if clinically appropriate', effects: 'Serotonergic effects, sedation risk, interaction with anesthetic/psychiatric drugs' },
  { name: 'Acai', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery and oral intake established', effects: 'Limited data, possible drug interactions' },
  { name: 'Aged garlic / garlic', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and when bleeding risk is low', effects: 'Bleeding risk, possible hypotension' },
  { name: 'Agrimony', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data; possible hypoglycaemic effects' },
  { name: 'Alfalfa', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypoglycaemia, immune effects, anticoagulant interaction' },
  { name: 'Aloe vera (oral preparations)', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery and stable electrolytes', effects: 'Laxative effect, dehydration, electrolyte disturbance' },
  { name: 'Andrographis', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, immune effects, allergy' },
  { name: 'Anise', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding risk, allergy, GI effects' },
  { name: 'Arnica', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Bleeding and cardiovascular effects' },
  { name: 'Artichoke leaf', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI and bile-flow effects' },
  { name: 'Arjuna', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and cardiovascular stability', effects: 'Hypotension, bradycardia' },
  { name: 'Asafoetida', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding effect, GI irritation' },
  { name: 'Ashwagandha', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, thyroid/BP effects' },
  { name: 'Astragalus', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune stimulation, drug interactions' },
  { name: 'Avena sativa / oats', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Bacopa', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation, GI effects' },
  { name: 'Baikal skullcap', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, hepatotoxicity concern' },
  { name: 'Barberry', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, drug interaction potential' },
  { name: 'Bayberry', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Vasoconstrictive and GI effects; limited perioperative data' },
  { name: 'Bee pollen', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Allergy/anaphylaxis risk' },
  { name: 'Bilberry', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible bleeding concern' },
  { name: 'Bitter melon', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia' },
  { name: 'Bitter orange', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After cardiovascular stability', effects: 'Sympathomimetic effects, hypertension, tachycardia' },
  { name: 'Bistort', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Astringent/GI effects; limited perioperative data' },
  { name: 'Black cohosh', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, hepatotoxicity concern' },
  { name: 'Black seed (Nigella sativa)', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose/BP', effects: 'Hypoglycaemia, hypotension, possible bleeding concern' },
  { name: 'Bladderwrack', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and thyroid stability', effects: 'Thyroid effects, iodine excess' },
  { name: 'Blessed thistle', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI irritation, allergy risk' },
  { name: 'Blue cohosh', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and cardiovascular stability', effects: 'Cardiovascular toxicity, hypertension' },
  { name: 'Blue flag', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI irritation/toxicity risk' },
  { name: 'Boldo', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hepatotoxicity concern' },
  { name: 'Boneset', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hepatotoxicity concern, GI irritation' },
  { name: 'Boswellia', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible antiplatelet effect, GI upset' },
  { name: 'Borage oil', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Bleeding concern, possible hepatotoxicity' },
  { name: 'Brahmi (Bacopa/Centella preparations)', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, GI effects' },
  { name: 'Bromelain', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Antiplatelet effect, bleeding concern' },
  { name: 'Buchu', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Diuretic effect, renal irritation' },
  { name: 'Buckthorn', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery and stable electrolytes', effects: 'Laxative effect, dehydration, electrolyte disturbance' },
  { name: 'Buddock / burdock', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Clinical evidence of hypotensive effects' },
  { name: 'Bupleurum', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hepatotoxicity concern, immune effects' },
  { name: 'Butterbur', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery; avoid if liver concerns', effects: 'Hepatotoxicity concern' },
  { name: 'California poppy', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, CNS depression' },
  { name: 'Calamus', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Potential carcinogenic/toxic CNS effects' },
  { name: 'Calendula (oral)', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation, allergy risk' },
  { name: 'Caper bush', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Capsicum / cayenne', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding effect, GI irritation' },
  { name: 'Caraway', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI effects' },
  { name: 'Cardamom', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible hypotension/bleeding effects' },
  { name: 'Carob supplements', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery and oral intake stable', effects: 'May alter oral drug absorption' },
  { name: 'Cat\'s claw', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and wound stability', effects: 'Bleeding and immune effects' },
  { name: 'Catnip', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation' },
  { name: 'Celandine', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery; avoid if liver concerns', effects: 'Hepatotoxicity concern' },
  { name: 'Celery seed', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Diuretic effect, photosensitivity' },
  { name: 'Cedar berry', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data; possible GI/renal irritation' },
  { name: 'Chaga mushroom', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Bleeding risk, hypoglycaemia' },
  { name: 'Chamomile', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Sedation, allergy, possible bleeding interaction' },
  { name: 'Chanca piedra', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Diuretic/hypotensive effects' },
  { name: 'Chasteberry', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hormonal effects' },
  { name: 'Chebulic myrobalan (Haritaki)', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery', effects: 'Laxative effect, electrolyte disturbance' },
  { name: 'Chinese herbal combination products', risk: 'Multiple / Unknown', stop: '2 weeks before surgery', restart: 'After recovery/discharge', effects: 'Unpredictable bleeding, sedation, interaction risks' },
  { name: 'Chitrak', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI irritation, limited safety data' },
  { name: 'Chlorella', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune effects, anticoagulant interaction concerns' },
  { name: 'Chondroitin', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding interaction' },
  { name: 'Cinnamon', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia, possible bleeding concern' },
  { name: 'Cissus quadrangularis', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible glucose effects' },
  { name: 'Clove oil / oral clove supplements', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Antiplatelet/bleeding effect' },
  { name: 'Coenzyme Q10', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and medication review', effects: 'May affect blood pressure and anticoagulation' },
  { name: 'Cola nut', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After cardiovascular stability', effects: 'Stimulant effects, tachycardia, hypertension' },
  { name: 'Coleus forskohlii', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and stable BP', effects: 'Hypotension, tachycardia, bleeding concern' },
  { name: 'Coltsfoot', risk: 'Drug Interactions', stop: '2 weeks before surgery', restart: 'Avoid restarting unless cleared clinically', effects: 'Hepatotoxicity concern' },
  { name: 'Comfrey', risk: 'Drug Interactions', stop: '2 weeks before surgery', restart: 'Do not restart without specialist advice', effects: 'Hepatotoxicity' },
  { name: 'Cordyceps', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune and glucose effects' },
  { name: 'Corn silk', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery and stable electrolytes', effects: 'Diuretic effect' },
  { name: 'Corydalis', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, CNS depression' },
  { name: 'Costus root', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Allergy, limited data' },
  { name: 'Cowslip', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedative/allergy effects' },
  { name: 'Cranberry', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible anticoagulant interaction' },
  { name: 'Damask rose (oral extract)', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation, limited data' },
  { name: 'Damiana', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible CNS and glucose effects' },
  { name: 'Danshen', risk: 'Bleeding', stop: '2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Significant bleeding risk, anticoagulant interaction' },
  { name: 'Dandelion', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery and stable electrolytes', effects: 'Diuretic effect, electrolyte disturbance' },
  { name: 'Devil\'s claw', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and GI stability', effects: 'Bleeding concern, GI irritation' },
  { name: 'Desmodium', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data, possible hepatic effects' },
  { name: 'Dong quai', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Bleeding risk' },
  { name: 'Dragon\'s blood resin', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible coagulation effects' },
  { name: 'Elderberry', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune stimulation' },
  { name: 'Elecampane', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Allergy/GI effects' },
  { name: 'Eleuthero (Siberian ginseng)', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and stable BP', effects: 'Hypertension, tachycardia' },
  { name: 'Ephedra (ma huang)', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After cardiovascular stability', effects: 'Hypertension, tachycardia, arrhythmia' },
  { name: 'Echinacea', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery and wound healing', effects: 'Immune effects, hepatotoxicity concern' },
  { name: 'Epimedium / horny goat weed', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and cardiovascular stability', effects: 'Hypotension, tachyarrhythmia risk' },
  { name: 'European mistletoe', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, immune effects' },
  { name: 'Evening primrose oil', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Bleeding concern, seizure-threshold concerns' },
  { name: 'Eyebright', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data, allergy risk' },
  { name: 'False unicorn root', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hormonal/GI effects' },
  { name: 'Fennel', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hormonal and possible bleeding effects' },
  { name: 'Fenugreek', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia, possible bleeding concern' },
  { name: 'Feverfew', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Platelet inhibition, bleeding risk' },
  { name: 'Flaxseed / flax oil', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and stable GI function', effects: 'Possible bleeding concern, GI effects' },
  { name: 'Fo-ti (He shou wu)', risk: 'Drug Interactions', stop: '2 weeks before surgery', restart: 'After recovery; avoid if liver concerns', effects: 'Hepatotoxicity' },
  { name: 'Fu ling / poria', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Fucus vesiculosus / kelp', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and thyroid stability', effects: 'Thyroid effects' },
  { name: 'Garcinia cambogia', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hepatotoxicity concern, serotonin-related effects' },
  { name: 'Garlic oil capsules', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Bleeding risk' },
  { name: 'Gentian', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI stimulation' },
  { name: 'Ginger', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and when bleeding risk is low', effects: 'Possible bleeding tendency' },
  { name: 'Ginkgo biloba', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and when bleeding risk is low', effects: 'Bleeding risk' },
  { name: 'Ginseng', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia, bleeding concern, haemodynamic effects' },
  { name: 'Grape seed extract', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible bleeding effect' },
  { name: 'Grapefruit / grapefruit extract', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery/discharge', effects: 'Enzyme inhibition, drug interactions' },
  { name: 'Graviola / soursop', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, neurotoxicity concerns' },
  { name: 'Gravel root', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Diuretic effect, limited data' },
  { name: 'Green tea extract', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and haemodynamic stability', effects: 'Caffeine-related tachycardia, possible coagulation effects' },
  { name: 'Guduchi (Tinospora cordifolia)', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune effects, hypoglycaemia' },
  { name: 'Guarana', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and haemodynamic stability', effects: 'Tachycardia, hypertension, agitation' },
  { name: 'Gymnema sylvestre', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia' },
  { name: 'Hawthorn', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After cardiovascular stability', effects: 'Hypotension, bleeding concern' },
  { name: 'Heartsease', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Helonias root', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited hormonal/GI effects' },
  { name: 'Hibiscus', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and stable BP', effects: 'Hypotension, glucose lowering' },
  { name: 'Honeybush', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data; possible phytoestrogenic effects' },
  { name: 'Hops', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation' },
  { name: 'Horehound', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible arrhythmia/GI effects' },
  { name: 'Horse chestnut', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible bleeding and vascular effects' },
  { name: 'Hydrangea root', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data, GI/renal irritation' },
  { name: 'Hydrocotyl / gotu kola', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, possible hepatotoxicity' },
  { name: 'Hyssop', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Seizure risk in high doses' },
  { name: 'Indian gooseberry (amla)', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and stable oral intake', effects: 'Possible bleeding risk, hypoglycaemia' },
  { name: 'Indian long pepper (Pippali)', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Drug-metabolism interactions' },
  { name: 'Jamaica dogwood', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedative effects' },
  { name: 'Jamun seed', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia' },
  { name: 'Jatamansi', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedative/CNS effects' },
  { name: 'Jiaogulan', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding and hypotension' },
  { name: 'Jujube', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation' },
  { name: 'Kanna', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Serotonergic/CNS effects' },
  { name: 'Kava', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After anesthetic recovery and no sedatives needed', effects: 'Sedation, CNS depression' },
  { name: 'Kratom', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'Only after specialist review', effects: 'Opioid-like effects, withdrawal, sedation' },
  { name: 'Kudzu', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, hormonal effects' },
  { name: 'Kutki', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible hepatic and GI effects' },
  { name: 'Lady\'s mantle', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Astringent effects; limited data' },
  { name: 'Lavender', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After anesthetic recovery', effects: 'Sedation' },
  { name: 'Lecithin', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative relevance; possible GI effects' },
  { name: 'Lemon balm', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation, possible thyroid effects' },
  { name: 'Lemon verbena', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation' },
  { name: 'Licorice', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and stable electrolytes/BP', effects: 'Hypokalaemia, hypertension, fluid retention' },
  { name: 'Linden flower', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedation, hypotension' },
  { name: 'Lobelia', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hypotension, tachycardia, toxicity risk' },
  { name: 'Longjack / Tongkat ali', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and cardiovascular stability', effects: 'Stimulant-like effects, BP changes' },
  { name: 'L-tryptophan', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and medication review', effects: 'Sedative effects, documented reports of additive effects with CNS depressants' },
  { name: 'Maca', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hormonal effects' },
  { name: 'Magnolia bark', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, CNS depression' },
  { name: 'Maitake mushroom', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia, bleeding concern' },
  { name: 'Manjistha', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible anticoagulant effects' },
  { name: 'Marshmallow root', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After oral medicines resumed', effects: 'May alter oral drug absorption' },
  { name: 'Meadowsweet', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Salicylate-like effects, bleeding/GI irritation' },
  { name: 'Milk thistle', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery/discharge', effects: 'Possible drug interactions' },
  { name: 'Moringa', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia, hypotension' },
  { name: 'Motherwort', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding and cardiovascular effects' },
  { name: 'Mucuna pruriens', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Dopaminergic effects, BP/nausea changes' },
  { name: 'Mugwort', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Allergy risk' },
  { name: 'Mullein', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Myrobalan triphala combinations', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery and stable electrolytes', effects: 'Laxative effect, dehydration/electrolyte disturbance' },
  { name: 'Myrrh', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding and glucose effects' },
  { name: 'Myrtle', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data' },
  { name: 'Natto / nattokinase', risk: 'Bleeding', stop: '2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Fibrinolytic/bleeding risk' },
  { name: 'Neem', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia, immune effects' },
  { name: 'Nettle', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery and stable BP/electrolytes', effects: 'Diuretic and BP effects' },
  { name: 'Noni', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery and stable renal/electrolyte status', effects: 'Hyperkalaemia risk, liver concerns' },
  { name: 'Nutmeg supplements', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'CNS effects, tachycardia in excess' },
  { name: 'Olive leaf extract', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and stable BP/glucose', effects: 'Hypotension, hypoglycaemia' },
  { name: 'Oregano oil', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding effect, GI irritation' },
  { name: 'Passionflower', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation, CNS depression' },
  { name: 'Pau d\'arco', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Anticoagulant/bleeding effect' },
  { name: 'Peach leaf', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Sedative/limited toxicity concerns' },
  { name: 'Peppermint oil', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery and normal GI function', effects: 'GI effects, reflux-related symptoms' },
  { name: 'Periwinkle', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'Avoid unless specialist-directed', effects: 'Cytotoxic/hematologic effects' },
  { name: 'Pipsissewa', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Diuretic/urinary effects' },
  { name: 'Plantain (herbal preparation)', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Pleurisy root', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible cardiotoxicity in excess' },
  { name: 'Poke root', risk: 'Neurotoxicity', stop: '2 weeks before surgery', restart: 'Do not restart without specialist advice', effects: 'Toxicity risk' },
  { name: 'Polygonatum', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Pomegranate extract', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible enzyme interaction' },
  { name: 'Prickly ash', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data, circulatory effects' },
  { name: 'Pseudoephedrine-containing herbal products / stimulant blends', risk: 'Cardiovascular', stop: '1 week before surgery', restart: 'After cardiovascular stability', effects: 'Hypertension, tachycardia, arrhythmia risk' },
  { name: 'Psyllium-containing herbal combinations', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery and oral intake established', effects: 'GI bulk effects, altered drug absorption' },
  { name: 'Quassia', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI irritation' },
  { name: 'Red clover', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Anticoagulant/bleeding effect' },
  { name: 'Red yeast rice', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery and stable liver status', effects: 'Statin-like effects, liver and muscle toxicity' },
  { name: 'Reishi mushroom', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Bleeding concern, immune effects' },
  { name: 'Rhapontic rhubarb', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery', effects: 'Laxative/GI effects' },
  { name: 'Rhodiola', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'CNS and haemodynamic effects' },
  { name: 'Rooibos extract', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Rosemary', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery and cardiovascular stability', effects: 'Potentially hypertensive effects' },
  { name: 'Rue', risk: 'Neurotoxicity', stop: '2 weeks before surgery', restart: 'Avoid restart unless clinically appropriate', effects: 'Bleeding/toxicity/photosensitivity concerns' },
  { name: 'S.A.M.e.', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and medication review', effects: 'Serotonergic interaction potential' },
  { name: 'Safflower', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible bleeding effect' },
  { name: 'Saffron', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Sedation, hypotension, possible bleeding effect' },
  { name: 'Sage', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'CNS effects, seizure risk in high doses' },
  { name: 'Saint John\'s wort', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery/discharge', effects: 'Drug interactions, enzyme induction, serotonin-related effects' },
  { name: 'Saw palmetto', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible bleeding concern' },
  { name: 'Schisandra', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery/discharge', effects: 'Hepatic enzyme effects, drug interactions' },
  { name: 'Senega', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'GI irritation, limited data' },
  { name: 'Senna', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery and stable electrolytes', effects: 'Laxative effect, dehydration, electrolyte disturbance' },
  { name: 'Shankhapushpi', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery', restart: 'After recovery and no sedatives needed', effects: 'Sedation' },
  { name: 'Shepherd\'s purse', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'BP/coagulation effects' },
  { name: 'Shiitake mushroom extract', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune and bleeding-related effects' },
  { name: 'Sida cordifolia', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After cardiovascular stability', effects: 'Sympathomimetic effects, hypertension, tachycardia' },
  { name: 'Slippery elm', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After oral meds and diet are re-established', effects: 'May impair oral drug absorption' },
  { name: 'Soy isoflavone / soy extract', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hormonal effects' },
  { name: 'Spearmint extract', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited data, GI effects' },
  { name: 'Spirulina', risk: 'Immune / Allergy', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Immune effects, contamination risk' },
  { name: 'Squill', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'Do not restart without specialist advice', effects: 'Cardiotoxicity concern' },
  { name: 'Stone root', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Limited perioperative data' },
  { name: 'Thuja', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'Avoid restart unless specifically advised', effects: 'Neurotoxicity concern' },
  { name: 'Thunder god vine', risk: 'Drug Interactions', stop: '2 weeks before surgery', restart: 'Only after specialist review', effects: 'Immunosuppression, renal/hepatic toxicity' },
  { name: 'Tribulus terrestris', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'BP/glucose effects, renal concerns' },
  { name: 'Turmeric / curcumin', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery and low bleeding risk', effects: 'Possible antiplatelet effect' },
  { name: 'Uva ursi', risk: 'Drug Interactions', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Renal irritation, hepatotoxicity concern' },
  { name: 'Valerian', risk: 'Sedation / CNS', stop: '1–2 weeks before surgery (ideally tapered)', restart: 'After recovery and reduced sedative need', effects: 'Sedation, withdrawal risk if abrupt stop' },
  { name: 'White mulberry leaf', risk: 'Hypoglycaemia', stop: '1–2 weeks before surgery', restart: 'After recovery and stable glucose', effects: 'Hypoglycaemia' },
  { name: 'Wild yam', risk: 'Hormonal', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Hormonal effects' },
  { name: 'Wormwood', risk: 'Neurotoxicity', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Neurotoxicity, seizure risk' },
  { name: 'Yarrow', risk: 'Bleeding', stop: '1–2 weeks before surgery', restart: 'After recovery', effects: 'Possible bleeding effect, allergy risk' },
  { name: 'Yellow dock', risk: 'GI / Electrolyte', stop: '1–2 weeks before surgery', restart: 'After GI recovery', effects: 'Laxative effect, GI irritation' },
  { name: 'Yohimbe', risk: 'Cardiovascular', stop: '1–2 weeks before surgery', restart: 'After cardiovascular stability', effects: 'Hypertension, tachycardia, agitation' },
];
const HERBAL_MEDICATIONS_SORTED = [...HERBAL_MEDICATIONS].sort((a, b) => a.name.localeCompare(b.name));

const MEDICATIONS = [
  { name: 'Aspirin', cls: 'Antiplatelet', rec: 'Hold (unless recent stent/ACS)', stop: '7 days', restart: '24–48h if hemostasis achieved', notes: 'Continue if high cardiac risk; consult cardiology' },
  { name: 'Clopidogrel (Plavix)', cls: 'Antiplatelet', rec: 'Hold', stop: '5 days', restart: '24–48h if hemostasis achieved', notes: 'Continue if high cardiac risk; consult cardiology' },
  { name: 'Prasugrel (Effient)', cls: 'Antiplatelet', rec: 'Hold', stop: '7 days', restart: '24–48h if hemostasis achieved', notes: 'As above' },
  { name: 'Ticagrelor (Brilinta)', cls: 'Antiplatelet', rec: 'Hold', stop: '5 days', restart: '24–48h if hemostasis achieved', notes: 'As above' },
  { name: 'Warfarin (Coumadin)', cls: 'Anticoagulant (VKA)', rec: 'Hold/bridge if high VTE risk', stop: '5 days', restart: 'When INR <2, hemostasis', notes: 'Bridge with LMWH for high-risk VTE/valve' },
  { name: 'Apixaban (Eliquis)', cls: 'DOAC', rec: 'Hold', stop: '24–48h', restart: '24–48h if no bleeding', notes: 'Longer for renal impairment' },
  { name: 'Rivaroxaban (Xarelto)', cls: 'DOAC', rec: 'Hold', stop: '24–48h', restart: '24–48h if no bleeding', notes: 'Longer for renal impairment' },
  { name: 'Dabigatran (Pradaxa)', cls: 'DOAC', rec: 'Hold', stop: '24–72h (72h if renal impaired)', restart: '24–48h if no bleeding', notes: 'Renally excreted' },
  { name: 'Edoxaban (Savaysa, Lixiana)', cls: 'DOAC', rec: 'Hold', stop: '24–48h', restart: '24–48h if no bleeding', notes: 'As above' },
  { name: 'Enoxaparin (Lovenox)', cls: 'LMWH', rec: 'Hold', stop: '12–24h', restart: '12–24h if no bleeding', notes: 'Use for bridging' },
  { name: 'Heparin (unfractionated)', cls: 'Anticoagulant', rec: 'Hold', stop: '4–6h', restart: '12–24h if no bleeding', notes: 'IV infusion stopped ~4hrs pre-op' },
  { name: 'Ibuprofen', cls: 'NSAID', rec: 'Hold', stop: '24h', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Naproxen', cls: 'NSAID', rec: 'Hold', stop: '3 days', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Diclofenac', cls: 'NSAID', rec: 'Hold', stop: '3 days', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Ketorolac', cls: 'NSAID', rec: 'Hold', stop: '24h', restart: 'When bleeding risk resolved', notes: 'Increased bleeding risk' },
  { name: 'Celecoxib (Celebrex)', cls: 'NSAID (COX-2 selective)', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Little bleeding risk' },
  { name: 'Sertraline (Zoloft)', cls: 'SSRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'May increase bleeding risk' },
  { name: 'Fluoxetine (Prozac)', cls: 'SSRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'As above' },
  { name: 'Paroxetine (Paxil)', cls: 'SSRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'As above' },
  { name: 'Citalopram (Celexa)', cls: 'SSRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'As above' },
  { name: 'Escitalopram (Lexapro)', cls: 'SSRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'As above' },
  { name: 'Venlafaxine (Effexor)', cls: 'SNRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'May increase bleeding risk' },
  { name: 'Duloxetine (Cymbalta)', cls: 'SNRI', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'As above' },
  { name: 'Amitriptyline (Elavil), Nortriptyline, Imipramine', cls: 'TCA', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Monitor for arrhythmias' },
  { name: 'Olanzapine (Zyprexa), Risperidone, Haloperidol, Quetiapine (Seroquel)', cls: 'Antipsychotic', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Watch for hypotension/QT prolongation' },
  { name: 'Phenelzine (Nardil), Tranylcypromine (Parnate), Selegiline', cls: 'MAOI', rec: 'Hold', stop: '2 weeks', restart: '1–2 wks after', notes: 'Risk of serotonin syndrome, HTN crisis' },
  { name: 'Lithium', cls: 'Mood stabilizer', rec: 'Hold', stop: '24–72h', restart: 'When eating, renal fxn normal', notes: 'Risk of toxicity peri-op' },
  { name: 'Metformin', cls: 'Biguanide (oral diabetic)', rec: 'Hold', stop: '24–48h (major/contrast), day of', restart: 'When eating, renal fxn stable', notes: 'Prevent lactic acidosis' },
  { name: 'Sulfonylureas (Glyburide, Glipizide, Gliclazide, etc.)', cls: 'Oral diabetic', rec: 'Hold', stop: 'Day of surgery', restart: 'When eating', notes: 'Hypoglycemia risk' },
  { name: 'Empagliflozin (Jardiance), Dapagliflozin (Farxiga), Canagliflozin (Invokana), Ertugliflozin (Steglatro)', cls: 'SGLT2 inhibitor', rec: 'Hold', stop: '3 days (4 for ertugliflozin)', restart: 'When eating, normal renal fxn', notes: 'Risk of euglycemic DKA' },
  { name: 'GLP-1 agonists (Liraglutide, Semaglutide, Exenatide, Dulaglutide, etc.)', cls: 'Injectable diabetic', rec: 'Hold', stop: 'Daily: day of surgery; Weekly (semaglutide/dulaglutide): 7 days prior', restart: 'When eating, no vomiting', notes: 'Aspiration risk — weekly preparations require 1-week hold (SAMBA/ASA 2023)' },
  { name: 'Metoprolol, Atenolol, Bisoprolol, Propranolol', cls: 'Beta-blocker', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Do not stop abruptly; may worsen cardiac risk' },
  { name: 'All ACE inhibitors', cls: 'ACE inhibitor', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'All ARBs', cls: 'ARB', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Amlodipine, Diltiazem, Verapamil', cls: 'Calcium channel blocker (CCB)', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'No increased perioperative risk' },
  { name: 'All diuretics', cls: 'Diuretic', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, euvolemic, labs normal', notes: 'Avoid hypovolemia/hypokalemia' },
  { name: 'Atorvastatin, Rosuvastatin, Simvastatin, Pravastatin', cls: 'Statin', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Cardioprotective' },
  { name: 'Levothyroxine, Liothyronine', cls: 'Thyroid hormone', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Maintain euthyroid state' },
  { name: 'Methimazole, Propylthiouracil (PTU)', cls: 'Antithyroid', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Prevent thyroid storm' },
  { name: 'Prednisone, Hydrocortisone, Dexamethasone', cls: 'Corticosteroid', rec: 'Continue; consider stress dose', stop: 'N/A', restart: 'N/A', notes: 'Prevent adrenal crisis in chronic users' },
  { name: 'Etanercept, Adalimumab, Infliximab, Certolizumab', cls: 'Biologic DMARD', rec: 'Hold 1–2 dosing cycles before surgery', stop: '1–2 cycles', restart: 'After wound healing, no infection', notes: 'Per ACR 2022 guidelines' },
  { name: 'Methotrexate, Hydroxychloroquine, Sulfasalazine, Leflunomide', cls: 'Nonbiologic DMARD', rec: 'Continue (unless infection/renal/lung dz)', stop: 'N/A', restart: 'N/A', notes: 'Per ACR 2022 guidelines' },
  { name: 'Omeprazole, Pantoprazole, Famotidine', cls: 'PPI/H2-blocker', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'No important peri-op issues' },
  { name: 'Salbutamol (Albuterol), Ipratropium', cls: 'Inhaled bronchodilator', rec: 'Continue', stop: 'N/A', restart: 'N/A', notes: 'Maintain asthma/COPD control' },
  { name: 'Oral contraceptives/HRT (Estrogen-containing)', cls: 'Hormonal', rec: 'Consider holding for high VTE risk/major surgery', stop: '4 weeks', restart: 'After full ambulation', notes: 'VTE risk' },
  { name: 'Herbal supplements (Ginkgo, Garlic, Ginseng, St John\'s Wort, Fish Oil)', cls: 'Herbal', rec: 'Hold', stop: '1–2 weeks', restart: 'After surgery', notes: 'Many increase bleeding risk/drug interactions' },
  { name: 'Captopril (Accorel, Capoten, Capozide, Capropril, Captozide, Carace, Carace HCT, Tensopril)', cls: 'ACEi', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Quinapril (Accupro, Accuretic)', cls: 'ACEi', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Enalapril (Enap, Innovace, Innovide)', cls: 'ACEi', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Ramipril (Triapin, Tritace)', cls: 'ACEi', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Lisinopril (Zestril, Lisopril, Zestran, Zesger, Zestoretic)', cls: 'ACEi', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Perindopril (Coversyl, Coversyl Plus)', cls: 'ACEi', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Losartan (Cozaar, Cozaar Comp)', cls: 'ARB', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Valsartan (CoDiovan, Diovan)', cls: 'ARB', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Irbesartan (Aprovel, CoAprovel)', cls: 'ARB', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension' },
  { name: 'Telmisartan (Micardis, Micardis Plus, Twynsta)', cls: 'ARB', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, normotensive', notes: 'Risk of intra-op hypotension (if combined with CCB, continue CCB)' },
  { name: 'Furosemide (Lasix)', cls: 'Loop diuretic', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, euvolemic, labs normal', notes: 'Monitor electrolytes' },
  { name: 'Bumetanide (Burinex K)', cls: 'Loop diuretic', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, euvolemic, labs normal', notes: 'Monitor electrolytes' },
  { name: 'Spironolactone (Aldactide 50, AldactoneCentyl K)', cls: 'K-sparing diuretic', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, check K+', notes: 'Monitor K+ and volume status' },
  { name: 'Bendroflumethiazide (Centyl K)', cls: 'Thiazide diuretic', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, euvolemic, labs normal', notes: 'Monitor electrolytes' },
  { name: 'Indapamide (Natrilix SR)', cls: 'Thiazide-like diuretic', rec: 'Hold morning of surgery', stop: 'Morning of surgery', restart: 'When stable, euvolemic, labs normal', notes: 'Monitor electrolytes' },
];
const COLUMN_WIDTHS = [240, 150, 230, 170, 170, 260];
const TABLE_WIDTH = COLUMN_WIDTHS.reduce((sum, width) => sum + width, 0);

const SECTION_ORDER = [
  'antithrombotic',
  'nsaid',
  'psychiatric',
  'diabetes',
  'cardio',
  'endocrine',
  'immuno',
  'other',
];

const SECTION_META = {
  antithrombotic: { label: 'ANTITHROMBOTIC MEDICATIONS', color: '#dc3545', icon: 'tint', textColor: COLORS.white },
  nsaid: { label: 'NSAID MEDICATIONS', color: '#6c757d', icon: 'pills', textColor: COLORS.white },
  psychiatric: { label: 'PSYCHIATRIC MEDICATIONS', color: '#17a2b8', icon: 'brain', textColor: COLORS.white },
  diabetes: { label: 'DIABETES MEDICATIONS', color: '#28a745', icon: 'chart-line', textColor: COLORS.white },
  cardio: { label: 'CARDIOVASCULAR MEDICATIONS', color: '#dc3545', icon: 'heart', textColor: COLORS.white },
  endocrine: { label: 'ENDOCRINE MEDICATIONS', color: '#6c757d', icon: 'capsules', textColor: COLORS.white },
  immuno: { label: 'IMMUNOSUPPRESSANTS', color: '#ffc107', icon: 'shield-virus', textColor: COLORS.dark },
  other: { label: 'SUPPLEMENTS & OTHERS', color: '#f8f9fa', icon: 'leaf', textColor: COLORS.dark, borderColor: COLORS.border },
};

const REFERENCE_ITEMS = [
  { text: 'UpToDate: Perioperative medication management', url: 'https://www.uptodate.com/contents/perioperative-medication-management' },
  { text: '2022 ACC/AHA Guideline for Perioperative Cardiovascular Evaluation', url: 'https://www.ahajournals.org/doi/10.1161/CIR.0000000000001098' },
  { text: '2022 ASA Practice Advisory for Preanesthesia Evaluation', url: 'https://anesthesiology.pubs.asahq.org/article.aspx?articleid=2774132' },
  { text: '2024 ADA Standards of Care: Perioperative Management', url: 'https://diabetesjournals.org/care/article/47/Supplement_1/S255/153222/15-Management-of-Diabetes-in-Hospitalized' },
  { text: '2022 ACR Guideline for Perioperative Management of Antirheumatic Medication', url: 'https://www.rheumatology.org/guidelines' },
  { text: 'ACCP perioperative antithrombotic guidance' },
  { text: 'SPAQI Perioperative Medication Toolkit (2023)' },
  { text: 'ACOG guidance on perioperative hormonal contraceptives (2024)' },
  { text: 'SAMBA/APSF guidance on GLP-1 agonists and aspiration risk' },
  { text: 'BJA Education: Perioperative medication management (2023)', url: 'https://bjaed.org/article/S2058-5349(23)00098-3/fulltext' },
];

async function openReference(url) {
  try {
    const canOpen = await Linking.canOpenURL(url);
    if (!canOpen) {
      Alert.alert('Unable to open link', 'Please open this reference in your browser.');
      return;
    }
    await Linking.openURL(url);
  } catch (error) {
    Alert.alert('Unable to open link', 'Please open this reference in your browser.');
  }
}

function getSectionKey(medication) {
  const cls = medication.cls.toLowerCase();

  if (cls.includes('antiplatelet') || cls.includes('anticoagulant')) return 'antithrombotic';
  if (cls.includes('nsaid')) return 'nsaid';
  if (cls.includes('ssri') || cls.includes('snri') || cls.includes('tca') || cls.includes('antipsychotic') || cls.includes('maoi') || cls.includes('mood stabilizer')) return 'psychiatric';
  if (cls.includes('diabetes')) return 'diabetes';
  if (cls.includes('beta-blocker') || cls.includes('ace inhibitor') || cls.includes('arb') || cls.includes('ccb') || cls.includes('diuretic') || cls.includes('statin')) return 'cardio';
  if (cls.includes('thyroid') || cls.includes('corticosteroid')) return 'endocrine';
  if (cls.includes('biologic') || cls.includes('dmard')) return 'immuno';
  return 'other';
}

export default function PerioperativeMedicationScreen() {
  const navigation = useNavigation();
  const [search, setSearch] = useState('');
  const [herbalSearch, setHerbalSearch] = useState('');
  const [activeTab, setActiveTab] = useState('periop');

  const filtered = useMemo(() => {
    if (!search.trim()) return MEDICATIONS;
    const q = search.toLowerCase();
    return MEDICATIONS.filter(m =>
      m.name.toLowerCase().includes(q) || m.cls.toLowerCase().includes(q)
    );
  }, [search]);

  const filteredHerbal = useMemo(() => {
    if (!herbalSearch.trim()) return HERBAL_MEDICATIONS_SORTED;
    const q = herbalSearch.toLowerCase();
    return HERBAL_MEDICATIONS_SORTED.filter(h =>
      h.name.toLowerCase().includes(q) || h.risk.toLowerCase().includes(q)
    );
  }, [herbalSearch]);

  const groupedRows = useMemo(() => {
    const grouped = SECTION_ORDER.reduce((acc, key) => ({ ...acc, [key]: [] }), {});

    filtered.forEach((med) => {
      grouped[getSectionKey(med)].push(med);
    });

    const rows = [];
    SECTION_ORDER.forEach((key) => {
      if (!grouped[key].length) return;
      rows.push({ type: 'section', key, meta: SECTION_META[key] });
      grouped[key].forEach((med) => {
        rows.push({ type: 'medication', key: `${key}-${med.name}`, med });
      });
    });

    return rows;
  }, [filtered]);

  const classBadgeStyle = (cls) => {
    const c = cls.toLowerCase();
    if (c.includes('anticoagulant')) return { backgroundColor: COLORS.danger, color: COLORS.white };
    if (c.includes('antiplatelet')) return { backgroundColor: COLORS.warning, color: COLORS.dark };
    if (c.includes('ssri') || c.includes('snri') || c.includes('tca') || c.includes('antipsychotic') || c.includes('mood stabilizer')) return { backgroundColor: COLORS.info, color: COLORS.white };
    if (c.includes('diabetes')) return { backgroundColor: COLORS.success, color: COLORS.white };
    if (c.includes('thyroid') || c.includes('corticosteroid')) return { backgroundColor: COLORS.dark, color: COLORS.white };
    if (c.includes('biologic') || c.includes('dmard')) return { backgroundColor: COLORS.warning, color: COLORS.dark };
    if (c.includes('herbal') || c.includes('hormonal') || c.includes('ppi') || c.includes('bronchodilator')) return { backgroundColor: COLORS.light, color: COLORS.dark };
    return { backgroundColor: COLORS.primary, color: COLORS.white };
  };

  const recStyle = (rec) => {
    if (rec.toLowerCase().includes('continue')) return { color: COLORS.success };
    if (rec.toLowerCase().includes('stop') || rec.toLowerCase().includes('hold')) return { color: COLORS.danger };
    return { color: '#856404' };
  };

  const getHerbalRiskStyle = (risk) => {
    const r = risk.toLowerCase();
    if (r.includes('bleeding')) return { backgroundColor: COLORS.danger, color: COLORS.white };
    if (r.includes('sedation') || r.includes('cns')) return { backgroundColor: '#ffc107', color: COLORS.dark };
    if (r.includes('cardiovascular')) return { backgroundColor: COLORS.info, color: COLORS.white };
    if (r.includes('hypoglycaemia')) return { backgroundColor: COLORS.success, color: COLORS.white };
    if (r.includes('drug interactions')) return { backgroundColor: COLORS.dark, color: COLORS.white };
    if (r.includes('gi') || r.includes('electrolyte')) return { backgroundColor: '#fd7e14', color: COLORS.white };
    if (r.includes('immune') || r.includes('allergy')) return { backgroundColor: COLORS.primary, color: COLORS.white };
    if (r.includes('hormonal')) return { backgroundColor: '#8e44ad', color: COLORS.white };
    if (r.includes('neurotoxicity') || r.includes('multiple')) return { backgroundColor: COLORS.dark, color: COLORS.white };
    return { backgroundColor: COLORS.border, color: COLORS.text };
  };

  return (
    <ScreenWrapper title="Perioperative Medication Management" subtitle="Comprehensive medication-by-medication perioperative guidelines (2024 Update)">
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'periop' && styles.tabButtonActive]}
          onPress={() => setActiveTab('periop')}
        >
          <FontAwesome5 name="pills" size={13} color={activeTab === 'periop' ? COLORS.white : COLORS.textMuted} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'periop' && styles.tabTextActive]}>Perioperative Medications</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'herbal' && styles.tabButtonActive]}
          onPress={() => setActiveTab('herbal')}
        >
          <FontAwesome5 name="leaf" size={13} color={activeTab === 'herbal' ? COLORS.white : COLORS.textMuted} style={styles.tabIcon} />
          <Text style={[styles.tabText, activeTab === 'herbal' && styles.tabTextActive]}>Herbal Medications</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>225+</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Perioperative Tab */}
      {activeTab === 'periop' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchCard}>
            <View style={styles.searchInputWrap}>
              <View style={styles.searchIconBox}>
                <FontAwesome5 name="search" size={13} color={COLORS.white} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Type medication name (e.g., aspirin, metformin, warfarin)..."
                value={search}
                onChangeText={setSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.searchMetaRow}>
              <Text style={styles.countText}>{filtered.length} medications found</Text>
              <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
                <FontAwesome5 name="times" size={11} color={COLORS.textMuted} style={styles.clearIcon} />
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.noticeBox}>
            <FontAwesome5 name="info-circle" size={14} color={COLORS.info} style={styles.noticeIcon} />
            <View style={styles.noticeContent}>
              <Text style={styles.noticeTitle}>Evidence-Based Guidelines (2024)</Text>
              <Text style={styles.noticeText}>
                Recommendations from major societies including ACC/AHA, ADA, ACR, ASA, ACCP, and ACOG.
              </Text>
              <Text style={styles.noticeSubText}>
                Always individualize care and consult anesthesia, surgery, and relevant specialties for complex cases.
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={styles.chartHeader}>
              <FontAwesome5 name="table" size={13} color={COLORS.white} style={styles.chartHeaderIcon} />
              <Text style={styles.chartHeaderText}>Comprehensive Perioperative Medication Chart</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
              <View style={styles.tableWrap}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[0] }]}>Medication Name (Trade/Generic)</Text>
                  <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[1] }]}>Class</Text>
                  <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[2] }]}>Perioperative Recommendation</Text>
                  <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[3] }]}>When to Stop Before Surgery</Text>
                  <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[4] }]}>When to Restart Postop</Text>
                  <Text style={[styles.tableHeaderCell, { width: COLUMN_WIDTHS[5] }]}>Key Notes</Text>
                </View>

                {groupedRows.map((row, i) => {
                  if (row.type === 'section') {
                    return (
                      <View
                        key={`section-${row.key}`}
                        style={[
                          styles.sectionBand,
                          {
                            backgroundColor: row.meta.color,
                            borderColor: row.meta.borderColor || row.meta.color,
                            width: TABLE_WIDTH,
                          },
                        ]}
                      >
                        <FontAwesome5 name={row.meta.icon} size={12} color={row.meta.textColor} style={styles.sectionBandIcon} />
                        <Text style={[styles.sectionBandText, { color: row.meta.textColor }]}>{row.meta.label}</Text>
                      </View>
                    );
                  }

                  const med = row.med;
                  const badge = classBadgeStyle(med.cls);

                  return (
                    <View key={row.key} style={[styles.tableDataRow, i % 2 === 1 && styles.tableDataRowAlt]}>
                      <Text style={[styles.tableDataCell, styles.medicationCell, { width: COLUMN_WIDTHS[0] }]}>{med.name}</Text>
                      <View style={[styles.tableDataCell, { width: COLUMN_WIDTHS[1] }]}> 
                        <Text style={[styles.classBadge, { backgroundColor: badge.backgroundColor, color: badge.color }]}>{med.cls}</Text>
                      </View>
                      <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[2] }, recStyle(med.rec)]}>{med.rec}</Text>
                      <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[3] }]}>{med.stop}</Text>
                      <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[4] }]}>{med.restart}</Text>
                      <Text style={[styles.tableDataCell, { width: COLUMN_WIDTHS[5] }]}>{med.notes}</Text>
                    </View>
                  );
                })}
              </View>
            </ScrollView>
          </View>

          {filtered.length === 0 && search.trim() ? (
            <View style={styles.noResultsBox}>
              <FontAwesome5 name="search" size={13} color="#856404" style={styles.noResultsIcon} />
              <View style={styles.noResultsTextWrap}>
                <Text style={styles.noResultsTitle}>No medications found</Text>
                <Text style={styles.noResultsText}>Try a different medication name or clear search to view all entries.</Text>
              </View>
            </View>
          ) : null}

          <View style={styles.updatesCard}>
            <View style={styles.updatesHeader}>
              <FontAwesome5 name="calendar-alt" size={13} color={COLORS.white} style={styles.updatesHeaderIcon} />
              <Text style={styles.updatesHeaderText}>Key Updates (2024) & References (2022-2024)</Text>
            </View>

            <View style={styles.updatesBody}>
              <Text style={styles.updatesTitle}>Key Updates (2024)</Text>
              <Text style={styles.updateItem}>• SGLT2 inhibitors: hold 3 days pre-op (4 days for ertugliflozin) to reduce euglycemic DKA risk.</Text>
              <Text style={styles.updateItem}>• Biologics/DMARDs: most non-biologic DMARDs can continue; biologics often held 1-2 dosing cycles pre-op.</Text>
              <Text style={styles.updateItem}>• GLP-1 agonists: hold day before/day of surgery per local anesthesia protocol due to aspiration risk.</Text>
              <Text style={styles.updateItem}>• Oral contraceptives/HRT: hold around 4 weeks before major high-VTE-risk surgery.</Text>
              <Text style={styles.updateItem}>• ACE inhibitors/ARBs: hold morning of surgery and restart when stable.</Text>
              <Text style={styles.updateItem}>• Antiplatelets: individualize around stent/ACS status; consult cardiology when needed.</Text>

              <Text style={styles.referencesTitle}>References</Text>
              {REFERENCE_ITEMS.map((ref, i) => (
                <View key={`ref-${i}`} style={styles.refItemRow}>
                  <Text style={styles.refIndex}>{i + 1}.</Text>
                  {ref.url ? (
                    <TouchableOpacity style={styles.refLinkTouch} onPress={() => openReference(ref.url)} activeOpacity={0.7}>
                      <Text style={[styles.refItem, styles.refLink]}>{ref.text}</Text>
                    </TouchableOpacity>
                  ) : (
                    <Text style={styles.refItem}>{ref.text}</Text>
                  )}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}

      {/* Herbal Tab */}
      {activeTab === 'herbal' && (
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.searchCard}>
            <View style={styles.searchInputWrap}>
              <View style={[styles.searchIconBox, { backgroundColor: COLORS.success }]}>
                <FontAwesome5 name="search" size={13} color={COLORS.white} />
              </View>
              <TextInput
                style={styles.searchInput}
                placeholder="Search herbal medication (e.g., garlic, ginkgo, valerian)..."
                value={herbalSearch}
                onChangeText={setHerbalSearch}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.searchMetaRow}>
              <Text style={styles.countText}>{filteredHerbal.length} herbs shown</Text>
              <TouchableOpacity onPress={() => setHerbalSearch('')} style={styles.clearBtn}>
                <FontAwesome5 name="times" size={11} color={COLORS.textMuted} style={styles.clearIcon} />
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.herbalAlertBox}>
            <FontAwesome5 name="exclamation-triangle" size={14} color="#856404" style={styles.herbalAlertIcon} />
            <View style={styles.herbalAlertContent}>
              <Text style={styles.herbalAlertTitle}>Perioperative Herbal Guidance</Text>
              <Text style={styles.herbalAlertText}>
                Advise all patients to stop herbal medications and supplements at least 1–2 weeks before elective surgery. Many interact significantly with anesthetic agents, anticoagulants, and other perioperative drugs. Always take a full herbal/supplement history at preoperative assessment.
              </Text>
            </View>
          </View>

          <View style={styles.chartCard}>
            <View style={[styles.chartHeader, { backgroundColor: COLORS.success }]}>
              <FontAwesome5 name="leaf" size={13} color={COLORS.white} style={styles.chartHeaderIcon} />
              <Text style={styles.chartHeaderText}>Herbal Medications Perioperative Reference (200+ Herbs)</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tableScrollContent}>
              <View style={styles.tableWrap}>
                <View style={styles.tableHeaderRow}>
                  <Text style={[styles.tableHeaderCell, { width: 200 }]}>Herbal Medication</Text>
                  <Text style={[styles.tableHeaderCell, { width: 140 }]}>Primary Risk</Text>
                  <Text style={[styles.tableHeaderCell, { width: 160 }]}>When to Stop</Text>
                  <Text style={[styles.tableHeaderCell, { width: 200 }]}>When to Restart</Text>
                  <Text style={[styles.tableHeaderCell, { width: 220 }]}>Potential Effects</Text>
                </View>

                {filteredHerbal.map((herb, i) => (
                  <View key={`herb-${i}`} style={[styles.tableDataRow, i % 2 === 1 && styles.tableDataRowAlt]}>
                    <Text style={[styles.tableDataCell, styles.medicationCell, { width: 200 }]}>{herb.name}</Text>
                    <View style={[styles.tableDataCell, { width: 140 }]}>
                      <Text style={[styles.herbalBadge, getHerbalRiskStyle(herb.risk)]}>{herb.risk}</Text>
                    </View>
                    <Text style={[styles.tableDataCell, { width: 160 }]}>{herb.stop}</Text>
                    <Text style={[styles.tableDataCell, { width: 200 }]}>{herb.restart}</Text>
                    <Text style={[styles.tableDataCell, { width: 220 }]}>{herb.effects}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {filteredHerbal.length === 0 && herbalSearch.trim() ? (
            <View style={styles.noResultsBox}>
              <FontAwesome5 name="search" size={13} color="#856404" style={styles.noResultsIcon} />
              <View style={styles.noResultsTextWrap}>
                <Text style={styles.noResultsTitle}>No herbs found</Text>
                <Text style={styles.noResultsText}>Try a different herb name or clear search to view all entries.</Text>
              </View>
            </View>
          ) : null}
        </ScrollView>
      )}

      <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
        <FontAwesome5 name="home" size={13} color={COLORS.white} style={styles.homeBtnIcon} />
        <Text style={styles.homeBtnText}>Back to Home</Text>
      </TouchableOpacity>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: 'row',
    marginBottom: SPACING.md,
    borderBottomWidth: 2,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    ...SHADOW,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabButtonActive: {
    backgroundColor: COLORS.primary,
    borderBottomColor: COLORS.primary,
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.textMuted,
  },
  tabTextActive: {
    color: COLORS.white,
  },
  badge: {
    backgroundColor: COLORS.success,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.white,
  },
  searchCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    padding: SPACING.md,
    marginBottom: SPACING.md,
    ...SHADOW,
  },
  searchInputWrap: { flexDirection: 'row', alignItems: 'center' },
  searchIconBox: {
    backgroundColor: COLORS.primary,
    width: 38,
    height: 38,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderLeftWidth: 0,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingVertical: 9,
    paddingHorizontal: 12,
    fontSize: 14,
    backgroundColor: COLORS.white,
  },
  searchMetaRow: {
    marginTop: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countText: { fontSize: 12, color: COLORS.textMuted },
  clearBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#f8f9fa',
  },
  clearIcon: { marginRight: 5 },
  clearText: { fontSize: 12, color: COLORS.textMuted, fontWeight: '600' },

  noticeBox: {
    backgroundColor: '#e8f4fd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#cfe8ff',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noticeIcon: { marginRight: 8, marginTop: 2 },
  noticeContent: { flex: 1 },
  noticeTitle: { fontSize: 13, fontWeight: '700', color: COLORS.medicalBlue, marginBottom: 2 },
  noticeText: { fontSize: 12, color: COLORS.text, lineHeight: 17, marginBottom: 2 },
  noticeSubText: { fontSize: 11, color: COLORS.textMuted, lineHeight: 16 },

  herbalAlertBox: {
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe69c',
    padding: SPACING.sm,
    marginBottom: SPACING.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  herbalAlertIcon: { marginRight: 8, marginTop: 2 },
  herbalAlertContent: { flex: 1 },
  herbalAlertTitle: { fontSize: 13, fontWeight: '700', color: '#856404', marginBottom: 2 },
  herbalAlertText: { fontSize: 12, color: '#856404', lineHeight: 17 },

  chartCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    overflow: 'hidden',
    ...SHADOW,
  },
  chartHeader: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartHeaderIcon: { marginRight: 8 },
  chartHeaderText: { color: COLORS.white, fontWeight: '700', fontSize: 14, flex: 1 },

  tableScrollContent: { paddingBottom: 2 },
  tableWrap: { borderWidth: 1, borderColor: COLORS.border, borderRadius: BORDER_RADIUS, overflow: 'hidden', backgroundColor: COLORS.white, margin: SPACING.sm },
  tableHeaderRow: { flexDirection: 'row', backgroundColor: '#212529', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableHeaderCell: { color: COLORS.white, fontWeight: '700', fontSize: 11, paddingVertical: 10, paddingHorizontal: 8, lineHeight: 15 },
  sectionBand: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  sectionBandIcon: { marginRight: 6 },
  sectionBandText: { fontWeight: '700', fontSize: 11 },
  tableDataRow: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: COLORS.border },
  tableDataRowAlt: { backgroundColor: '#f8f9fa' },
  tableDataCell: { fontSize: 11, color: COLORS.text, lineHeight: 16, paddingVertical: 9, paddingHorizontal: 8 },
  medicationCell: { fontWeight: '700' },
  classBadge: { fontSize: 11, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden', alignSelf: 'flex-start' },
  herbalBadge: { fontSize: 11, borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, overflow: 'hidden', alignSelf: 'flex-start' },

  noResultsBox: {
    marginTop: SPACING.md,
    backgroundColor: '#fff3cd',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffe69c',
    padding: SPACING.sm,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noResultsIcon: { marginRight: 8, marginTop: 2 },
  noResultsTextWrap: { flex: 1 },
  noResultsTitle: { fontSize: 13, fontWeight: '700', color: '#856404', marginBottom: 2 },
  noResultsText: { fontSize: 12, color: '#856404', lineHeight: 17 },

  updatesCard: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS,
    marginTop: SPACING.md,
    overflow: 'hidden',
    ...SHADOW,
  },
  updatesHeader: {
    backgroundColor: COLORS.success,
    paddingHorizontal: SPACING.md,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  updatesHeaderIcon: { marginRight: 8 },
  updatesHeaderText: { color: COLORS.white, fontSize: 13, fontWeight: '700', flex: 1 },
  updatesBody: { padding: SPACING.md },
  updatesTitle: { fontSize: 14, color: COLORS.success, fontWeight: '700', marginBottom: SPACING.xs },
  updateItem: { fontSize: 12, color: COLORS.text, lineHeight: 17, marginBottom: 6 },
  referencesTitle: { fontSize: 14, color: COLORS.info, fontWeight: '700', marginTop: SPACING.sm, marginBottom: SPACING.xs },
  refItemRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 3 },
  refIndex: { width: 18, fontSize: 11, color: COLORS.text, lineHeight: 16 },
  refLinkTouch: { flex: 1 },
  refItem: { flex: 1, fontSize: 11, color: COLORS.text, lineHeight: 16 },
  refLink: { color: COLORS.primary, textDecorationLine: 'underline' },

  homeBtn: {
    marginTop: SPACING.md,
    backgroundColor: COLORS.primary,
    borderRadius: BORDER_RADIUS,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...SHADOW,
  },
  homeBtnIcon: { marginRight: 8 },
  homeBtnText: { color: COLORS.white, fontWeight: '700', fontSize: 14 },
});



