import React from 'react';
import { View, Text } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS, SHADOW } from '../utils/theme';

// Helper function to render protocol content based on structure
export const renderProtocolContent = (content, styles) => {
  if (!content) return null;

  const elements = [];

  if (content.sections && Array.isArray(content.sections)) {
    content.sections.forEach((section, index) => {
      elements.push(
        <View key={`section-${index}`}>
          {section.title && (
            <View style={styles.sectionHeaderRow}>
              <FontAwesome5
                name={section.icon || 'info-circle'}
                size={13}
                color={section.color || COLORS.primary}
                style={styles.sectionHeaderIcon}
              />
              <Text style={styles.sectionHeaderTitle}>{section.title}</Text>
            </View>
          )}
          {section.items && Array.isArray(section.items) && (
            <View style={styles.infoCard}>
              {section.items.map((item, i) => (
                <Text key={`item-${i}`} style={styles.sectionItem}>
                  • {item}
                </Text>
              ))}
            </View>
          )}
        </View>
      );
    });
  }

  if (content.description) {
    elements.push(
      <Text key="description" style={styles.sectionItem}>
        {content.description}
      </Text>
    );
  }

  return elements;
};
