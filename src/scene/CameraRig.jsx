import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// Eases the camera toward a named preset (position + look-at) instead of
// snapping instantly, so clicking "Vanity view" / "Shower view" reads as a
// deliberate camera move rather than a jarring cut. Works alongside
// OrbitControls by lerping its `target` too and calling `.update()`, so
// the user can keep orbiting normally once the transition settles.
export default function CameraRig({ position, lookAt, controlsRef }) {
  const { camera } = useThree();
  const posTarget = useRef(new THREE.Vector3(...position));
  const lookTarget = useRef(new THREE.Vector3(...lookAt));

  useEffect(() => {
    posTarget.current.set(position[0], position[1], position[2]);
    lookTarget.current.set(lookAt[0], lookAt[1], lookAt[2]);
  }, [position, lookAt]);

  useFrame(() => {
    camera.position.lerp(posTarget.current, 0.08);
    const controls = controlsRef.current;
    if (controls) {
      controls.target.lerp(lookTarget.current, 0.08);
      controls.update();
    } else {
      camera.lookAt(lookTarget.current);
    }
  });

  return null;
}
