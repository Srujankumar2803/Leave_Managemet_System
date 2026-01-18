import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Typed version of useDispatch hook
 * Use this instead of plain useDispatch to get proper types
 */
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();

/**
 * Typed version of useSelector hook
 * Use this instead of plain useSelector to get proper types
 */
export const useAppSelector = useSelector.withTypes<RootState>();
