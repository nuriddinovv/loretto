// shared/ui/ProtectedScreen/ProtectedScreen.tsx
import React, { useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { PermissionKey } from '@/widgets/homeMenu/model/modules';
import { useAuth } from '@/entities';

export type ProtectedScreenProps = {
  children: React.ReactNode;
  requiredPermission?: PermissionKey;
};

export function ProtectedScreen({
  children,
  requiredPermission,
}: ProtectedScreenProps) {
  const { can } = useAuth();
  const navigation = useNavigation();

  useEffect(() => {
    if (requiredPermission && !can(requiredPermission)) {
      Alert.alert(
        "Ruxsat yo'q",
        "Bu bo'limga kirishga ruxsatingiz yo'q",
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false },
      );
    }
  }, [requiredPermission, can, navigation]);

  if (requiredPermission && !can(requiredPermission)) {
    return null;
  }

  return <>{children}</>;
}
