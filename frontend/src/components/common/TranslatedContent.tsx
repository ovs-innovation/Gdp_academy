import React from 'react'
import { useAutoTranslateText, useAutoTranslate } from '../../hooks/useAutoTranslate'

interface TranslatedContentProps {
  children: any
  enabled?: boolean
}

export const TranslatedContent: React.FC<TranslatedContentProps> = ({ 
  children, 
  enabled = true 
}) => {
  if (!enabled || !children) {
    return null
  }

  // Safely extract text from potentially localized object or standard string
  let text = ''
  if (typeof children === 'string') {
    text = children
  } else if (typeof children === 'object') {
    const currentLang = localStorage.getItem('i18nextLng') || 'en'
    text = children[currentLang] || children['en'] || Object.values(children)[0] || ''
  } else {
    text = String(children)
  }

  const { translatedText } = useAutoTranslateText(text, enabled)
  return <>{translatedText}</>
}

interface TranslatedObjectProps<T> {
  data: T
  children: (translatedData: T) => React.ReactNode
  enabled?: boolean
}

export const TranslatedObject = <T extends Record<string, any>>({
  data,
  children,
  enabled = true,
}: TranslatedObjectProps<T>) => {
  const { translatedData } = useAutoTranslate(data, { enabled })
  return <>{children(translatedData)}</>
}
