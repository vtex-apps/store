import React from 'react'

export const IOMessage: React.FC<{ id: string }> = ({ id }) => <>{id}</>

export const formatIOMessage = ({ id }: { id: string }) => id
