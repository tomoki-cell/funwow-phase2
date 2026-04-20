import { SignIn } from '@clerk/nextjs'

export default function SignInPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">ログイン</h1>
          <p className="text-gray-500 text-sm">funwow アカウントでログインしてください</p>
        </div>
        <div className="flex justify-center">
          <SignIn
            appearance={{
              elements: {
                rootBox: 'w-full',
                card: 'shadow-none border border-gray-100 rounded-2xl',
                headerTitle: 'hidden',
                headerSubtitle: 'hidden',
                socialButtonsBlockButton:
                  'border border-gray-200 hover:border-gray-400 rounded-full transition-colors',
                formButtonPrimary:
                  'bg-gray-900 hover:bg-gray-700 rounded-full transition-colors',
                footerActionLink: 'text-gray-900 hover:text-gray-700',
              },
            }}
          />
        </div>
      </div>
    </div>
  )
}
