import { ReactNode } from 'react';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

const DEFAULT_EDGES: Edge[] = ['right', 'bottom', 'left'];

type Props = {
  children: ReactNode;
  edges?: Edge[];
  style?: any;
};

export default function SafeArea({
  children,
  edges = DEFAULT_EDGES,
  style,
}: Props) {
  return (
    <SafeAreaView style={[{ flex: 1 }, style]} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
