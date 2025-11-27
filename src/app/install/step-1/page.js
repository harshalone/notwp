import React from 'react';
import { getExecSqlFunction } from '@/lib/sql/exec-function';
import Step1Client from './Step1Client';

export default async function Step1Page() {
  // Read the SQL function from the migration file
  const execSqlFunction = await getExecSqlFunction();

  return <Step1Client execSqlFunction={execSqlFunction} />;
}
