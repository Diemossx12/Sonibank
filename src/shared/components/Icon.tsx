import React from 'react';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';

type IconFamily = 'ion' | 'feather' | 'mci';

interface IconProps {
  name: string;
  size?: number;
  color?: string;
  family?: IconFamily;
}

export const Icon: React.FC<IconProps> = ({
  name, size = 22, color = '#0A0E1A', family = 'feather'
}) => {
  if (family === 'ion') return <Ionicons name={name as any} size={size} color={color} />;
  if (family === 'mci') return <MaterialCommunityIcons name={name as any} size={size} color={color} />;
  return <Feather name={name as any} size={size} color={color} />;
};
