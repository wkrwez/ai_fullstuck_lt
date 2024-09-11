import { Theme } from '@/src/theme/colors/type';
import {
  SkeletonCircle,
  SkeletonColumn,
  SkeletonRow,
  SkeletonSpan
} from '../skeletion';

export function CommentSkeletion({ theme }: { theme: Theme }) {
  return (
    <SkeletonColumn gap={30} repeat={3}>
      <SkeletonRow gap={12}>
        <SkeletonCircle size={36} theme={theme} />
        <SkeletonColumn style={{ flex: 1 }} gap={6}>
          <SkeletonSpan height={16} width={'50%'} radius={3} theme={theme} />
          <SkeletonSpan theme={theme} height={16} width={'60%'} radius={3} />
          <SkeletonSpan theme={theme} height={16} width={'30%'} radius={3} />
        </SkeletonColumn>
      </SkeletonRow>
    </SkeletonColumn>
  );
}
