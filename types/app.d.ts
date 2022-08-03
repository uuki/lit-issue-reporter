import { Config } from '@/contexts/app';
import '@/components/functional/Movable/Movable';
import '@/components/atoms/CircleButton/CircleButton';
import '@/components/layouts/ReportLayout/ReportLayout';
export declare type ReporterConfig = Config;
export declare function createReporter({ token, repoName, repoOwner, localesLoader, lang }: ReporterConfig): void;
