import { useState } from 'react';

export const ContactForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error('Request failed');
      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setStatus('error');
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 text-left">
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">Name</span>
        <input
          required
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">Email</span>
        <input
          required
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A]"
        />
      </label>
      <label className="block">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0B1F3A]">Message</span>
        <textarea
          required
          name="message"
          rows={6}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="mt-1.5 w-full border border-gray-300 rounded-md px-3 py-2.5 text-sm text-[#0B1F3A] focus:outline-none focus:border-[#0B1F3A] resize-y"
        />
      </label>
      <button
        type="submit"
        disabled={status === 'sending'}
        className="w-full sm:w-auto px-8 py-3 bg-[#0B1F3A] hover:bg-[#16325C] disabled:opacity-60 text-white text-xs font-bold uppercase tracking-widest rounded-md cursor-pointer"
      >
        {status === 'sending' ? 'Sending…' : 'Send message'}
      </button>
      {status === 'sent' && (
        <p className="text-sm text-[#0B1F3A]">Thank you. Your message is on its way to us.</p>
      )}
      {status === 'error' && (
        <p className="text-sm text-[#0B1F3A]">We could not send that just now. Please try again in a moment.</p>
      )}
    </form>
  );
};
